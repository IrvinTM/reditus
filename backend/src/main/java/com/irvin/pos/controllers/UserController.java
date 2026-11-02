package com.irvin.pos.controllers;

import com.irvin.pos.dtos.CreateUserRequestDTO;
import com.irvin.pos.dtos.UserDTO;
import com.irvin.pos.services.UserManagementService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class UserController {

    private final UserManagementService userManagementService;

    public UserController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequestDTO request) {
        return ResponseEntity.ok(userManagementService.createUser(request));
    }

    @GetMapping
    public List<UserDTO> getUsers() {
        return userManagementService.getAllUsers();
    }
}
