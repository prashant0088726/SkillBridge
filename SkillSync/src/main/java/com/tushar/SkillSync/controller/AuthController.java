package com.tushar.SkillSync.controller;

import com.tushar.SkillSync.dto.ApiResponse;
import com.tushar.SkillSync.dto.AuthResponse;
import com.tushar.SkillSync.dto.LoginRequest;
import com.tushar.SkillSync.dto.RegisterRequest;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        AuthResponse response = new AuthResponse(null, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
