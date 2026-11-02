package com.irvin.pos.configuration;

import com.irvin.pos.entities.UserAccount;
import com.irvin.pos.entities.UserRole;
import com.irvin.pos.repositories.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DefaultUserSeeder {

    @Bean
    public CommandLineRunner seedDefaultUser(
        UserAccountRepository userAccountRepository,
        PasswordEncoder passwordEncoder,
        @Value("${app.security.seed-default-user:true}") boolean shouldSeedDefaultUser,
        @Value("${app.security.username:admin}") String username,
        @Value("${app.security.password:admin123}") String password
    ) {
        return args -> {
            if (!shouldSeedDefaultUser) {
                return;
            }
            UserAccount existing = userAccountRepository.findByUsername(username).orElse(null);
            if (existing != null) {
                // installs from before this check may still be using the default password
                if (!existing.isMustChangePassword() && passwordEncoder.matches(password, existing.getPassword())) {
                    existing.setMustChangePassword(true);
                    userAccountRepository.save(existing);
                }
                return;
            }

            UserAccount account = new UserAccount();
            account.setUsername(username);
            account.setPassword(passwordEncoder.encode(password));
            account.setRole(UserRole.ADMINISTRADOR);
            account.setName(username);
            account.setEmail(username + "@local");
            account.setEnabled(true);
            account.setMustChangePassword(true);
            userAccountRepository.save(account);
        };
    }
}
