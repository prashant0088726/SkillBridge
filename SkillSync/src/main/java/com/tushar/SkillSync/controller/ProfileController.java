package com.tushar.SkillSync.controller;

import com.tushar.SkillSync.dto.ApiResponse;
import com.tushar.SkillSync.dto.CandidateDashboardDto;
import com.tushar.SkillSync.dto.UserProfileDto;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.service.DashboardService;
import com.tushar.SkillSync.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final DashboardService dashboardService;

    public ProfileController(ProfileService profileService, DashboardService dashboardService) {
        this.profileService = profileService;
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(@AuthenticationPrincipal User user) {
        UserProfileDto profile = profileService.getProfileByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(@AuthenticationPrincipal User user,
                                                                     @RequestBody UserProfileDto dto) {
        UserProfileDto updated = profileService.updateProfile(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<CandidateDashboardDto>> getDashboard(@AuthenticationPrincipal User user) {
        CandidateDashboardDto dashboard = dashboardService.getDashboardData(user);
        return ResponseEntity.ok(ApiResponse.ok(dashboard));
    }
}
