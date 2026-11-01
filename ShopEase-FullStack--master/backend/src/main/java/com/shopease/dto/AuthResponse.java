package com.shopease.dto;

import java.util.List;

public class AuthResponse {

    private Long userId;
    private String fullName;
    private String email;
    private List<String> roles;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(
            Long userId,
            String fullName,
            String email,
            List<String> roles,
            String message) {

        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.roles = roles;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}