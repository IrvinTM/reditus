package com.irvin.pos.configuration;

import java.io.IOException;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.irvin.pos.repositories.UserAccountRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Users flagged with mustChangePassword (e.g. the seeded admin/admin123) can only change their password
 * until they do.
 */
@Component
public class PasswordChangeRequiredFilter extends OncePerRequestFilter {

    private static final Set<String> ALLOWED_PATHS = Set.of("/api/auth/me", "/api/auth/change-password",
            "/api/auth/login");

    private final UserAccountRepository userAccountRepository;

    public PasswordChangeRequiredFilter(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !ALLOWED_PATHS.contains(request.getServletPath())
                && userAccountRepository.findByUsername(authentication.getName())
                        .map(account -> account.isMustChangePassword())
                        .orElse(false)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                    "{\"status\":403,\"error\":\"PASSWORD_CHANGE_REQUIRED\",\"path\":\"" + request.getServletPath() + "\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
