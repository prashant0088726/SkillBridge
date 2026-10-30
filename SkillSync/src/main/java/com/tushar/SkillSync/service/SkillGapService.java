package com.tushar.SkillSync.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tushar.SkillSync.dto.SkillGapRequest;
import com.tushar.SkillSync.entity.Resume;
import com.tushar.SkillSync.entity.SkillGap;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.repository.ResumeRepository;
import com.tushar.SkillSync.repository.SkillGapRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillGapService {

    private final GeminiAiService geminiAiService;
    private final SkillGapRepository skillGapRepository;
    private final ResumeRepository resumeRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SkillGapService(GeminiAiService geminiAiService,
                           SkillGapRepository skillGapRepository,
                           ResumeRepository resumeRepository) {
        this.geminiAiService = geminiAiService;
        this.skillGapRepository = skillGapRepository;
        this.resumeRepository = resumeRepository;
    }

    @Transactional
    public List<SkillGap> analyzeGaps(User user, SkillGapRequest request) {
        String resumeText = "";
        if (request.getResumeId() != null) {
            Resume resume = resumeRepository.findById(request.getResumeId()).orElse(null);
            if (resume != null && resume.getRawText() != null) {
                resumeText = resume.getRawText();
            }
        }

        if (resumeText.isBlank()) {
            List<Resume> userResumes = resumeRepository.findByUserIdOrderByUploadedAtDesc(user.getId());
            if (!userResumes.isEmpty()) {
                resumeText = userResumes.get(0).getRawText();
            }
        }

        String targetRole = request.getTargetJobRole();
        String jobDescription = request.getJobDescription() != null ? request.getJobDescription() : "";

        String prompt = """
        You are an expert technical career advisor and competency evaluator.
        Perform a thorough Skill-Gap Analysis comparing the candidate's resume against their target role.

        Target Role: %s
        Job Description / Details: %s

        Candidate Resume:
        %s

        Analyze the key technical and domain skills required for this role.
        Return ONLY a valid JSON array of objects.
        No markdown, no backticks.

        JSON structure:
        [
          {
            "skillName": "Spring Security",
            "category": "NEEDS_IMPROVEMENT",
            "importance": "CRITICAL",
            "currentProficiency": "Beginner",
            "desiredProficiency": "Advanced",
            "priority": "High",
            "prerequisites": "Java Core, Spring Boot Basics",
            "recommendedAction": "Implement JWT authentication and OAuth2 integration in a project"
          }
        ]

        Valid values:
        - category: "DEMONSTRATED", "NEEDS_IMPROVEMENT", "NOT_DEMONSTRATED"
        - importance: "CRITICAL", "HIGH", "MEDIUM", "LOW"
        - currentProficiency: "None", "Beginner", "Intermediate", "Advanced"
        - desiredProficiency: "Intermediate", "Advanced", "Expert"
        - priority: "High", "Medium", "Low"

        Provide between 5 to 10 prioritized skill gaps.
        Order them strictly by priority (High first) and importance (Critical first).
        """.formatted(targetRole, jobDescription, resumeText.isBlank() ? "No resume provided. Assume an entry-to-mid career baseline." : resumeText);

        String aiResponse = geminiAiService.generate(prompt);

        List<SkillGap> results = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(aiResponse);
            if (root.isArray()) {
                for (JsonNode node : root) {
                    SkillGap gap = new SkillGap();
                    gap.setUser(user);
                    gap.setTargetRole(targetRole);
                    gap.setSkillName(node.path("skillName").asText("Unknown Skill"));
                    gap.setCategory(node.path("category").asText("NEEDS_IMPROVEMENT"));
                    gap.setImportance(node.path("importance").asText("HIGH"));
                    gap.setCurrentProficiency(node.path("currentProficiency").asText("Beginner"));
                    gap.setDesiredProficiency(node.path("desiredProficiency").asText("Advanced"));
                    gap.setPriority(node.path("priority").asText("High"));
                    gap.setPrerequisites(node.path("prerequisites").asText("Basic programming"));
                    gap.setRecommendedAction(node.path("recommendedAction").asText("Study and build practical projects"));

                    results.add(skillGapRepository.save(gap));
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Skill-Gap AI results: " + e.getMessage(), e);
        }

        return results;
    }

    public List<SkillGap> getUserGaps(Long userId) {
        return skillGapRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public SkillGap updateProficiency(Long userId, Long gapId, String currentProficiency) {
        SkillGap gap = skillGapRepository.findById(gapId)
                .orElseThrow(() -> new IllegalArgumentException("Skill gap not found with id: " + gapId));

        if (!gap.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to modify this skill gap.");
        }

        gap.setCurrentProficiency(currentProficiency);
        if ("Advanced".equalsIgnoreCase(currentProficiency) || "Expert".equalsIgnoreCase(currentProficiency)) {
            gap.setCategory("DEMONSTRATED");
            gap.setPriority("Low");
        }
        return skillGapRepository.save(gap);
    }
}
