package com.irvin.pos.services;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.irvin.pos.dtos.BackupDTO;
import com.irvin.pos.exceptions.EntityNotFoundException;

/**
 * Database backups with pg_dump / pg_restore (custom format), stored in a local folder.
 * Point app.backup.dir to a USB drive or a cloud-synced folder to keep a copy off the machine.
 */
@Service
public class BackupService {

    private static final Logger log = LoggerFactory.getLogger(BackupService.class);
    private static final Pattern BACKUP_NAME = Pattern.compile("reditus-\\d{8}-\\d{6}(-[a-z]+)?\\.dump");
    // scheduled or manual backups, the only ones removed automatically
    private static final Pattern REGULAR_BACKUP_NAME = Pattern.compile("reditus-\\d{8}-\\d{6}\\.dump");
    private static final DateTimeFormatter FILE_TIMESTAMP = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")
            .withZone(ZoneId.systemDefault());
    private static final Duration STALE_AFTER = Duration.ofHours(48);
    private static final long PROCESS_TIMEOUT_MINUTES = 30;

    private final Path backupDir;
    private final int keep;
    private final String pgDump;
    private final String pgRestore;
    private final String host;
    private final String port;
    private final String database;
    private final String username;
    private final String password;

    private volatile String lastError;
    private volatile Instant lastErrorAt;

    public BackupService(
            @Value("${app.backup.dir:backups}") String backupDir,
            @Value("${app.backup.keep:14}") int keep,
            @Value("${app.backup.pg-dump:pg_dump}") String pgDump,
            @Value("${app.backup.pg-restore:pg_restore}") String pgRestore,
            @Value("${spring.datasource.url}") String jdbcUrl,
            @Value("${spring.datasource.username}") String username,
            @Value("${spring.datasource.password}") String password) {
        this.backupDir = Path.of(backupDir).toAbsolutePath();
        this.keep = Math.max(keep, 1);
        this.pgDump = pgDump;
        this.pgRestore = pgRestore;
        // jdbc:postgresql://host:port/database?params
        URI uri = URI.create(jdbcUrl.substring("jdbc:".length()));
        this.host = uri.getHost() == null ? "localhost" : uri.getHost();
        this.port = uri.getPort() == -1 ? "5432" : String.valueOf(uri.getPort());
        this.database = uri.getPath().substring(1);
        this.username = username;
        this.password = password;
    }

    @Scheduled(cron = "${app.backup.cron:0 0 2 * * *}")
    public void scheduledBackup() {
        try {
            createBackup();
        } catch (RuntimeException e) {
            log.error("Scheduled backup failed", e);
        }
    }

    public synchronized BackupDTO.File createBackup() {
        return createBackup(null);
    }

    private BackupDTO.File createBackup(String suffix) {
        try {
            Files.createDirectories(backupDir);
            String name = "reditus-" + FILE_TIMESTAMP.format(Instant.now()) + (suffix == null ? "" : "-" + suffix)
                    + ".dump";
            Path target = backupDir.resolve(name);
            Path partial = backupDir.resolve(name + ".part");
            run(List.of(pgDump, "--format=custom", "--no-owner", "--no-privileges", "--host=" + host, "--port=" + port,
                    "--username=" + username, "--file=" + partial, database));
            Files.move(partial, target, StandardCopyOption.ATOMIC_MOVE);
            lastError = null;
            lastErrorAt = null;
            prune();
            log.info("Backup created: {}", target);
            return toFile(target);
        } catch (IOException | RuntimeException e) {
            lastError = e.getMessage();
            lastErrorAt = Instant.now();
            throw new IllegalStateException("No se pudo crear la copia de seguridad: " + e.getMessage(), e);
        }
    }

    public BackupDTO status() {
        List<BackupDTO.File> files = list();
        Instant lastBackupAt = files.isEmpty() ? null : files.get(0).createdAt();
        boolean stale = lastBackupAt == null || lastBackupAt.isBefore(Instant.now().minus(STALE_AFTER));
        return new BackupDTO(backupDir.toString(), lastBackupAt, stale, lastError, lastErrorAt, files);
    }

    public Path resolve(String name) {
        if (name == null || !BACKUP_NAME.matcher(name).matches()) {
            throw new IllegalArgumentException("Nombre de copia inválido.");
        }
        Path path = backupDir.resolve(name);
        if (!Files.isRegularFile(path)) {
            throw new EntityNotFoundException("Backup " + name);
        }
        return path;
    }

    /** Saves an uploaded backup (e.g. from a USB drive) so it can be restored. */
    public synchronized BackupDTO.File upload(InputStream content) {
        try {
            Files.createDirectories(backupDir);
            String name = "reditus-" + FILE_TIMESTAMP.format(Instant.now()) + "-uploaded.dump";
            Path target = backupDir.resolve(name);
            Files.copy(content, target);
            return toFile(target);
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo guardar el archivo: " + e.getMessage(), e);
        }
    }

    /**
     * Replaces the database contents with a backup. A backup of the current data is taken first.
     */
    public synchronized BackupDTO.File restore(String name) {
        Path source = resolve(name);
        BackupDTO.File safety = createBackup("prerestore");
        run(List.of(pgRestore, "--clean", "--if-exists", "--no-owner", "--no-privileges", "--single-transaction",
                "--host=" + host, "--port=" + port, "--username=" + username, "--dbname=" + database,
                source.toString()));
        log.warn("Database restored from {} (previous data saved in {})", name, safety.name());
        return safety;
    }

    private List<BackupDTO.File> list() {
        if (!Files.isDirectory(backupDir)) {
            return List.of();
        }
        try (Stream<Path> paths = Files.list(backupDir)) {
            List<BackupDTO.File> files = new ArrayList<>();
            for (Path path : paths.filter(p -> BACKUP_NAME.matcher(p.getFileName().toString()).matches()).toList()) {
                files.add(toFile(path));
            }
            files.sort(Comparator.comparing(BackupDTO.File::createdAt).reversed());
            return files;
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo leer la carpeta de copias: " + e.getMessage(), e);
        }
    }

    // keeps the newest scheduled/manual backups; pre-restore and uploaded copies are kept until deleted by hand
    private void prune() throws IOException {
        List<BackupDTO.File> regular = list().stream()
                .filter(f -> REGULAR_BACKUP_NAME.matcher(f.name()).matches())
                .toList();
        for (BackupDTO.File old : regular.subList(Math.min(keep, regular.size()), regular.size())) {
            Files.deleteIfExists(backupDir.resolve(old.name()));
        }
    }

    private BackupDTO.File toFile(Path path) throws IOException {
        return new BackupDTO.File(path.getFileName().toString(), Files.size(path),
                Files.getLastModifiedTime(path).toInstant());
    }

    private void run(List<String> command) {
        try {
            ProcessBuilder builder = new ProcessBuilder(command).redirectErrorStream(true);
            builder.environment().put("PGPASSWORD", password == null ? "" : password);
            Process process = builder.start();
            process.getOutputStream().close();
            byte[] output = process.getInputStream().readAllBytes();
            if (!process.waitFor(PROCESS_TIMEOUT_MINUTES, TimeUnit.MINUTES)) {
                process.destroyForcibly();
                throw new IllegalStateException(command.get(0) + " timed out");
            }
            if (process.exitValue() != 0) {
                throw new IllegalStateException(command.get(0) + " failed: "
                        + new String(output, StandardCharsets.UTF_8).trim());
            }
        } catch (IOException e) {
            throw new IllegalStateException("Could not run " + command.get(0)
                    + ". Is the PostgreSQL client installed? (" + e.getMessage() + ")", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(command.get(0) + " interrupted", e);
        }
    }
}
