package com.shopease.security;

import com.shopease.exception.InvalidLoginException;
import com.shopease.model.User;
import com.shopease.model.enums.ERole;
import com.shopease.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public CurrentUserProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {

            throw new InvalidLoginException("Please login to continue.");
        }

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new InvalidLoginException("Please login to continue."));
    }

    public boolean isAdmin(User user) {

        return user.getRoles()
                .stream()
                .anyMatch(role ->
                        role.getRoleName() == ERole.ROLE_ADMIN);
    }
}