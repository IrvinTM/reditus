package com.irvin.pos.services;

import com.irvin.pos.entities.UserAccount;
import com.irvin.pos.entities.UserRole;
import com.irvin.pos.repositories.UserAccountRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UserAccountRepository userAccountRepository;

    public DatabaseUserDetailsService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount account = userAccountRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserRole role = account.getRole() != null ? account.getRole() : UserRole.CAJERO;

        return new User(
            account.getUsername(),
            account.getPassword(),
            account.isEnabled(),
            true,
            true,
            true,
            List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
        );
    }
}
