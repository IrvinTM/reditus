package com.irvin.pos.services;

import com.irvin.pos.dtos.CreateUserRequestDTO;
import com.irvin.pos.dtos.UserDTO;
import com.irvin.pos.entities.UserAccount;
import com.irvin.pos.entities.UserRole;
import com.irvin.pos.repositories.UserAccountRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserManagementService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO createUser(CreateUserRequestDTO request) {
        String username = normalize(request.getUsername());
        if (username == null) {
            throw new IllegalArgumentException("username is required");
        }

        if (userAccountRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("username already exists: " + username);
        }

        String rawPassword = request.getPassword();
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("password is required");
        }

        UserRole role = UserRole.from(request.getRole());

        UserAccount account = new UserAccount();
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(rawPassword));
        account.setRole(role);
        account.setName(defaultIfBlank(request.getName(), username));
        account.setEmail(defaultIfBlank(request.getEmail(), username + "@local"));
        account.setEnabled(request.getEnabled() == null || request.getEnabled());

        UserAccount saved = userAccountRepository.save(account);
        return toDTO(saved);
    }

    public List<UserDTO> getAllUsers() {
        return userAccountRepository.findAll().stream().map(this::toDTO).toList();
    }

    private UserDTO toDTO(UserAccount account) {
        UserRole role = account.getRole() != null ? account.getRole() : UserRole.CAJERO;
        return new UserDTO(
            account.getId(),
            account.getUsername(),
            role.name(),
            account.getName(),
            account.getEmail(),
            account.isEnabled()
        );
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }

        return trimmed;
    }

    private String defaultIfBlank(String value, String fallback) {
        String normalized = normalize(value);
        return normalized != null ? normalized : fallback;
    }
}
