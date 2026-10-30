package com.tushar.SkillSync.controller;

import com.tushar.SkillSync.dto.ApiResponse;
import com.tushar.SkillSync.dto.SkillGapRequest;
import com.tushar.SkillSync.entity.SkillGap;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.service.SkillGapService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillGapController {

    private final SkillGapService skillGapService;

    public SkillGapController(SkillGapService skillGapService) {
        this.skillGapService = skillGapService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<List<SkillGap>>> analyzeSkillGaps(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SkillGapRequest request
    ) {
        List<SkillGap> gaps = skillGapService.analyzeGaps(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Skill gap analysis completed", gaps));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillGap>>> getUserSkillGaps(@AuthenticationPrincipal User user) {
        List<SkillGap> gaps = skillGapService.getUserGaps(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(gaps));
    }

    @PatchMapping("/{id}/proficiency")
    public ResponseEntity<ApiResponse<SkillGap>> updateProficiency(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Long gapId,
            @RequestBody Map<String, String> body
    ) {
        String proficiency = body.get("currentProficiency");
        if (proficiency == null || proficiency.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("currentProficiency is required"));
        }
        SkillGap updated = skillGapService.updateProficiency(user.getId(), gapId, proficiency);
        return ResponseEntity.ok(ApiResponse.ok("Proficiency updated", updated));
    }
}
