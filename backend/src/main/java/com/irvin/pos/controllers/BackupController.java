package com.irvin.pos.controllers;

import java.io.IOException;
import java.nio.file.Path;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.irvin.pos.dtos.BackupDTO;
import com.irvin.pos.services.BackupService;

@RestController
@RequestMapping("/api/backups")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
    }

    @GetMapping
    public BackupDTO status() {
        return backupService.status();
    }

    @PostMapping
    public BackupDTO.File create() {
        return backupService.createBackup();
    }

    @GetMapping("/{name}")
    public ResponseEntity<Resource> download(@PathVariable String name) {
        Path path = backupService.resolve(name);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + path.getFileName() + "\"")
                .body(new FileSystemResource(path));
    }

    @PostMapping("/upload")
    public BackupDTO.File upload(@RequestParam("file") MultipartFile file) throws IOException {
        return backupService.upload(file.getInputStream());
    }

    /** Returns the backup of the data that was replaced. */
    @PostMapping("/{name}/restore")
    public BackupDTO.File restore(@PathVariable String name) {
        return backupService.restore(name);
    }
}
