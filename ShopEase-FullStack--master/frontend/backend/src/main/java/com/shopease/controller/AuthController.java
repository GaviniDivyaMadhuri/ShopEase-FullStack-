package com.shopease.controller;

import com.shopease.dto.AuthResponse;
import com.shopease.dto.LoginRequest;
import com.shopease.dto.RegisterRequest;
import com.shopease.exception.InvalidLoginException;
import com.shopease.model.Role;
import com.shopease.model.User;
import com.shopease.repository.UserRepository;
import com.shopease.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final UserRepository userRepository;

    public AuthController(
            AuthService authService,
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository,
            UserRepository userRepository) {

        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return toAuthResponse(
                user,
                "Registration successful. Please login."
        );
    }

    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getEmail(),
                                    request.getPassword()
                            )
                    );

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);

            SecurityContextHolder.setContext(context);

            HttpSession session =
                    httpRequest.getSession(true);

            session.setAttribute(
                    "SPRING_SECURITY_CONTEXT",
                    context
            );

            securityContextRepository.saveContext(
                    context,
                    httpRequest,
                    httpResponse
            );

            User user = userRepository
                    .findByEmail(request.getEmail())
                    .orElseThrow(() ->
                            new InvalidLoginException(
                                    "Invalid email or password."
                            )
                    );

            return toAuthResponse(
                    user,
                    "Login successful."
            );

        } catch (BadCredentialsException ex) {

            throw new InvalidLoginException(
                    "Invalid email or password."
            );
        }
    }

    // =========================================================
    // LOGOUT
    // =========================================================

    @PostMapping("/logout")
    public Map<String, String> logout(
            HttpServletRequest request) {

        HttpSession session =
                request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return Map.of(
                "message",
                "Logged out successfully."
        );
    }

    // =========================================================
    // CURRENT LOGGED-IN USER
    // =========================================================

    @GetMapping("/me")
    public AuthResponse me() {

        User user = getLoggedInUser();

        return toAuthResponse(
                user,
                "Currently logged in."
        );
    }

    // =========================================================
    // PROFILE - GET
    // =========================================================

    @GetMapping("/profile")
    public Map<String, Object> getProfile() {

        User user = getLoggedInUser();

        Map<String, Object> profile =
                new HashMap<>();

        profile.put(
                "userId",
                user.getUserId()
        );

        profile.put(
                "fullName",
                user.getFullName()
        );

        profile.put(
                "email",
                user.getEmail()
        );

        profile.put(
                "phone",
                user.getPhone()
        );

        profile.put(
                "enabled",
                user.isEnabled()
        );

        return profile;
    }

    // =========================================================
    // PROFILE - UPDATE
    // =========================================================

    @PutMapping("/profile")
    public Map<String, Object> updateProfile(
            @RequestBody Map<String, String> request) {

        User user = getLoggedInUser();

        String fullName =
                request.get("fullName");

        String phone =
                request.get("phone");

        // Full Name
        if (fullName != null
                && !fullName.trim().isEmpty()) {

            user.setFullName(
                    fullName.trim()
            );
        }

        // Phone
        if (phone != null) {

            user.setPhone(
                    phone.trim()
            );
        }

        User updatedUser =
                userRepository.save(user);

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "userId",
                updatedUser.getUserId()
        );

        response.put(
                "fullName",
                updatedUser.getFullName()
        );

        response.put(
                "email",
                updatedUser.getEmail()
        );

        response.put(
                "phone",
                updatedUser.getPhone()
        );

        response.put(
                "message",
                "Profile updated successfully."
        );

        return response;
    }

    // =========================================================
    // GET LOGGED-IN USER
    // =========================================================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(
                        authentication.getPrincipal())) {

            throw new InvalidLoginException(
                    "Not logged in."
            );
        }

        return userRepository
                .findByEmail(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new InvalidLoginException(
                                "Not logged in."
                        )
                );
    }

    // =========================================================
    // AUTH RESPONSE
    // =========================================================

    private AuthResponse toAuthResponse(
            User user,
            String message) {

        List<String> roleNames =
                user.getRoles()
                        .stream()
                        .map(Role::getRoleName)
                        .map(Enum::name)
                        .toList();

        return new AuthResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                roleNames,
                message
        );
    }
}