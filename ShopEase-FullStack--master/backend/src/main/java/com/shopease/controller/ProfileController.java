package com.shopease.controller;

import com.shopease.dto.ProfileResponse;
import com.shopease.dto.UpdateProfileRequest;
import com.shopease.model.Role;
import com.shopease.model.User;
import com.shopease.repository.UserRepository;
import com.shopease.security.CurrentUserProvider;

import jakarta.validation.Valid;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final CurrentUserProvider currentUserProvider;
    private final UserRepository userRepository;

    public ProfileController(CurrentUserProvider currentUserProvider,
                             UserRepository userRepository) {
        this.currentUserProvider = currentUserProvider;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ProfileResponse getProfile() {

        User user = currentUserProvider.getCurrentUser();

        return toResponse(user);
    }

    @PutMapping
    @Transactional
    public ProfileResponse updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {

        User user = currentUserProvider.getCurrentUser();

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        User updated = userRepository.save(user);

        return toResponse(updated);
    }

    private ProfileResponse toResponse(User user) {

        List<String> roleNames = user.getRoles()
                .stream()
                .map(Role::getRoleName)
                .map(Enum::name)
                .toList();

        return new ProfileResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                roleNames
        );
    }
}