package com.alpha.dto;

import com.alpha.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record RegisterRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password,
        @NotNull Role role,
        String nationality,
        String countryOfResidence
    ) {}

    public record RegisterResponse(
        Long userId,
        String email,
        String fullName,
        Role role,
        String message
    ) {}

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}

    public record LoginResponse(
        String token,
        Long userId,
        String email,
        String fullName,
        Role role
    ) {}
}
