package com.irvin.pos.dtos;

import java.time.Instant;
import java.util.List;

/**
 * @param stale true when there is no backup from the last 48 hours
 */
public record BackupDTO(
    String directory,
    Instant lastBackupAt,
    boolean stale,
    String lastError,
    Instant lastErrorAt,
    List<File> files
) {
    public record File(String name, long size, Instant createdAt) {
    }
}
