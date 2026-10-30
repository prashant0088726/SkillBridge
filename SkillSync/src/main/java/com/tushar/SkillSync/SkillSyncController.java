package com.tushar.SkillSync;

import com.tushar.SkillSync.dto.ApiResponse;
import com.tushar.SkillSync.entity.Resume;
import com.tushar.SkillSync.entity.ResumeAnalysis;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class SkillSyncController {

    private final ResumeService resumeService;

    public SkillSyncController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAiStatus() {
        return ResponseEntity.ok(resumeService.getAiStatus());
    }

    @PostMapping("/analyze")
    public Map<String, Object> analyser(@RequestParam("file") MultipartFile file,
                                        @AuthenticationPrincipal User user) throws Exception {
        return resumeService.analyzeResume(file, user);
    }

    @PostMapping("/ats-check")
    public Map<String, Object> analyzeATS(@RequestParam("file") MultipartFile file,
                                          @RequestParam("jd") String jobDescription,
                                          @AuthenticationPrincipal User user) throws Exception {
        return resumeService.analyzeATS(file, jobDescription, user);
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ResumeAnalysis>>> getResumeHistory(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required for history"));
        }
        List<ResumeAnalysis> analyses = resumeService.getUserAnalyses(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(analyses));
    }

    @GetMapping("/my-resumes")
    public ResponseEntity<ApiResponse<List<Resume>>> getUserResumes(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        List<Resume> resumes = resumeService.getUserResumes(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(resumes));
    }
}
