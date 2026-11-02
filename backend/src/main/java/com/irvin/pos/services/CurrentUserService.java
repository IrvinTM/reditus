package com.irvin.pos.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.irvin.pos.entities.UserAccount;
import com.irvin.pos.repositories.UserAccountRepository;

@Service
public class CurrentUserService {

    private final UserAccountRepository userAccountRepository;

    public CurrentUserService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    /** The authenticated user making the request. */
    public UserAccount get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user.");
        }
        return userAccountRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("No authenticated user."));
    }
}
