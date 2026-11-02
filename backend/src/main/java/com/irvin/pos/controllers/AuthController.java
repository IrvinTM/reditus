package com.irvin.pos.controllers;

import com.irvin.pos.configuration.JwtService;
import com.irvin.pos.dtos.LoginRequestDTO;
import com.irvin.pos.dtos.LoginResponseDTO;
import com.irvin.pos.entities.UserAccount;
import com.irvin.pos.entities.UserRole;
import com.irvin.pos.repositories.UserAccountRepository;
import com.irvin.pos.services.UserManagementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserAccountRepository userAccountRepository;
    private final JwtService jwtService;
    private final UserManagementService userManagementService;

    public AuthController(
        AuthenticationManager authenticationManager,
        UserAccountRepository userAccountRepository,
        JwtService jwtService,
        UserManagementService userManagementService
    ) {
        this.authenticationManager = authenticationManager;
        this.userAccountRepository = userAccountRepository;
        this.jwtService = jwtService;
        this.userManagementService = userManagementService;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        UserAccount account = userAccountRepository.findByUsername(userDetails.getUsername()).orElse(null);

        String name = userDetails.getUsername();
        String email = userDetails.getUsername();
        UserRole role = UserRole.CAJERO;

        if (account != null) {
            name = account.getName() != null ? account.getName() : name;
            email = account.getEmail() != null ? account.getEmail() : email;
            role = account.getRole() != null ? account.getRole() : role;
        }

        String token = jwtService.generateToken(userDetails, role.name());
        boolean mustChangePassword = account != null && account.isMustChangePassword();
        return new LoginResponseDTO(token, name, email, role.name(), mustChangePassword);
    }

    @GetMapping("/me")
    public LoginResponseDTO me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return new LoginResponseDTO("", "", "", "", false);
        }

        String username = authentication.getName();
        UserAccount account = userAccountRepository.findByUsername(username).orElse(null);

        if (account == null) {
            return new LoginResponseDTO("", username, username, UserRole.CAJERO.name(), false);
        }

        String role = account.getRole() != null ? account.getRole().name() : UserRole.CAJERO.name();
        return new LoginResponseDTO("", account.getName(), account.getEmail(), role, account.isMustChangePassword());
    }

    public record ChangePasswordRequest(String currentPassword, String newPassword) {
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(Authentication authentication, @RequestBody ChangePasswordRequest request) {
        userManagementService.changePassword(authentication.getName(), request.currentPassword(), request.newPassword());
        return ResponseEntity.noContent().build();
    }
}
