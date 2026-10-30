package com.tushar.SkillSync.controller;

import com.tushar.SkillSync.dto.AiAssistantRequest;
import com.tushar.SkillSync.dto.ApiResponse;
import com.tushar.SkillSync.dto.RoadmapGenerateRequest;
import com.tushar.SkillSync.dto.TaskStatusRequest;
import com.tushar.SkillSync.entity.LearningRoadmap;
import com.tushar.SkillSync.entity.RoadmapTask;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.service.RoadmapService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<LearningRoadmap>> generateRoadmap(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RoadmapGenerateRequest request
    ) {
        LearningRoadmap roadmap = roadmapService.generateRoadmap(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Personalized AI Learning Roadmap created", roadmap));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LearningRoadmap>>> getUserRoadmaps(@AuthenticationPrincipal User user) {
        List<LearningRoadmap> roadmaps = roadmapService.getUserRoadmaps(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(roadmaps));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<LearningRoadmap>> getActiveRoadmap(@AuthenticationPrincipal User user) {
        return roadmapService.getActiveRoadmap(user.getId())
                .map(r -> ResponseEntity.ok(ApiResponse.ok(r)))
                .orElse(ResponseEntity.ok(ApiResponse.ok("No active roadmap found", null)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LearningRoadmap>> getRoadmapById(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Long id
    ) {
        LearningRoadmap roadmap = roadmapService.getRoadmapById(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok(roadmap));
    }

    @PatchMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse<RoadmapTask>> toggleTaskStatus(
            @AuthenticationPrincipal User user,
            @PathVariable("taskId") Long taskId,
            @RequestBody(required = false) TaskStatusRequest request
    ) {
        Boolean isCompleted = request != null ? request.getIsCompleted() : null;
        RoadmapTask updated = roadmapService.toggleTaskCompletion(taskId, user.getId(), isCompleted);
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", updated));
    }

    @PostMapping("/assistant")
    public ResponseEntity<ApiResponse<Map<String, String>>> askAiAssistant(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AiAssistantRequest request
    ) {
        String answer = roadmapService.askAssistant(user, request);
        return ResponseEntity.ok(ApiResponse.ok("AI response generated", Map.of("answer", answer)));
    }
}
