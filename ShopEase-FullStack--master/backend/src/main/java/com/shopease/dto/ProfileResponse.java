package com.shopease.dto;

import java.util.List;

public class ProfileResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private List<String> roles;

    public ProfileResponse() {
    }

    public ProfileResponse(Long userId,
                           String fullName,
                           String email,
                           String phone,
                           List<String> roles) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.roles = roles;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}