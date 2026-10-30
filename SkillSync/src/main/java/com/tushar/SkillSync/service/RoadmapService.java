package com.tushar.SkillSync.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tushar.SkillSync.dto.AiAssistantRequest;
import com.tushar.SkillSync.dto.RoadmapGenerateRequest;
import com.tushar.SkillSync.entity.*;
import com.tushar.SkillSync.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RoadmapService {

    private final GeminiAiService geminiAiService;
    private final LearningRoadmapRepository roadmapRepository;
    private final RoadmapMilestoneRepository milestoneRepository;
    private final RoadmapTaskRepository taskRepository;
    private final CandidateProfileRepository profileRepository;
    private final ResumeRepository resumeRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RoadmapService(GeminiAiService geminiAiService,
                          LearningRoadmapRepository roadmapRepository,
                          RoadmapMilestoneRepository milestoneRepository,
                          RoadmapTaskRepository taskRepository,
                          CandidateProfileRepository profileRepository,
                          ResumeRepository resumeRepository) {
        this.geminiAiService = geminiAiService;
        this.roadmapRepository = roadmapRepository;
        this.milestoneRepository = milestoneRepository;
        this.taskRepository = taskRepository;
        this.profileRepository = profileRepository;
        this.resumeRepository = resumeRepository;
    }

    @Transactional
    public LearningRoadmap generateRoadmap(User user, RoadmapGenerateRequest request) {
        // Collect candidate context
        CandidateProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        String candidateSkills = profile != null && profile.getTechnicalSkills() != null ? profile.getTechnicalSkills() : "Foundational knowledge";
        String candidateExp = request.getExperienceLevel() != null ? request.getExperienceLevel() : (profile != null && profile.getExperienceLevel() != null ? profile.getExperienceLevel() : "Mid-Level");
        int weeklyHours = request.getWeeklyHours() != null && request.getWeeklyHours() > 0 ? request.getWeeklyHours() : (profile != null && profile.getWeeklyHoursAvailable() != null ? profile.getWeeklyHoursAvailable() : 10);
        String learningStyle = request.getLearningStyle() != null ? request.getLearningStyle() : (profile != null && profile.getLearningStyle() != null ? profile.getLearningStyle() : "Project-based");

        String prompt = """
        You are an elite AI technical career mentor and curriculum architect.
        Generate a highly structured, personalized "AI Career Growth Roadmap" for this candidate.

        Target Role: %s
        Current Experience Level: %s
        Current Skills / Background: %s
        Available Study Time: %d hours per week
        Preferred Learning Style: %s
        Additional Notes: %s

        Generate a 4-to-6 week personalized roadmap.
        Return ONLY valid JSON matching this exact structure:
        {
          "title": "Roadmap to %s",
          "totalEstimatedHours": 40,
          "milestones": [
            {
              "weekNumber": 1,
              "title": "Milestone Title",
              "description": "Clear explanation of this milestone and why it matters.",
              "estimatedHours": 10,
              "tasks": [
                {
                  "title": "Task or Topic Title",
                  "description": "Concise actionable learning task, concept explanation, or exercise instructions.",
                  "taskType": "THEORY",
                  "resourceTitle": "Official Documentation or Guide",
                  "resourceUrl": "https://developer.mozilla.org/ or official docs"
                },
                {
                  "title": "Hands-on Practice / Mini-Project",
                  "description": "Build a specific working component or solve real coding problem.",
                  "taskType": "PRACTICE",
                  "resourceTitle": "GitHub or Documentation",
                  "resourceUrl": "https://github.com"
                }
              ]
            }
          ]
        }

        Rules:
        - Task types must be one of: "THEORY", "PRACTICE", "MINI_PROJECT", "PORTFOLIO_PROJECT", "ASSESSMENT".
        - The final week MUST include a "PORTFOLIO_PROJECT" capstone.
        - Every task must have practical instructions tailored to the candidate's experience level.
        - Use official, established resources (e.g. spring.io, developer.mozilla.org, docs.oracle.com, react.dev, docs.docker.com).
        - No markdown formatting, strictly valid JSON.
        """.formatted(
                request.getTargetJobRole(),
                candidateExp,
                candidateSkills,
                weeklyHours,
                learningStyle,
                request.getCustomNotes() != null ? request.getCustomNotes() : "None",
                request.getTargetJobRole()
        );

        String aiResponse = geminiAiService.generate(prompt);

        try {
            JsonNode root = objectMapper.readTree(aiResponse);

            LearningRoadmap roadmap = new LearningRoadmap();
            roadmap.setUser(user);
            roadmap.setTitle(root.path("title").asText("AI Career Roadmap: " + request.getTargetJobRole()));
            roadmap.setTargetRole(request.getTargetJobRole());
            roadmap.setExperienceLevel(candidateExp);
            roadmap.setWeeklyHours(weeklyHours);
            roadmap.setTotalEstimatedHours(root.path("totalEstimatedHours").asInt(weeklyHours * 4));
            roadmap.setProgressPercentage(0);
            roadmap.setStatus("ACTIVE");

            roadmap = roadmapRepository.save(roadmap);

            JsonNode milestonesNode = root.path("milestones");
            if (milestonesNode.isArray()) {
                int milestoneIdx = 0;
                for (JsonNode mNode : milestonesNode) {
                    RoadmapMilestone milestone = new RoadmapMilestone();
                    milestone.setRoadmap(roadmap);
                    milestone.setWeekNumber(mNode.path("weekNumber").asInt(milestoneIdx + 1));
                    milestone.setTitle(mNode.path("title").asText("Week " + (milestoneIdx + 1)));
                    milestone.setDescription(mNode.path("description").asText(""));
                    milestone.setEstimatedHours(mNode.path("estimatedHours").asInt(weeklyHours));
                    milestone.setOrderIndex(milestoneIdx++);
                    milestone = milestoneRepository.save(milestone);

                    JsonNode tasksNode = mNode.path("tasks");
                    if (tasksNode.isArray()) {
                        int taskIdx = 0;
                        for (JsonNode tNode : tasksNode) {
                            RoadmapTask task = new RoadmapTask();
                            task.setMilestone(milestone);
                            task.setTitle(tNode.path("title").asText("Task " + (taskIdx + 1)));
                            task.setDescription(tNode.path("description").asText(""));
                            task.setTaskType(tNode.path("taskType").asText("PRACTICE"));
                            task.setResourceTitle(tNode.path("resourceTitle").asText("Resource"));
                            task.setResourceUrl(tNode.path("resourceUrl").asText("https://docs.oracle.com"));
                            task.setIsCompleted(false);
                            task.setOrderIndex(taskIdx++);
                            taskRepository.save(task);
                        }
                    }
                }
            }

            return roadmapRepository.findById(roadmap.getId()).orElse(roadmap);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse and save AI Career Roadmap: " + e.getMessage(), e);
        }
    }

    public List<LearningRoadmap> getUserRoadmaps(Long userId) {
        return roadmapRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<LearningRoadmap> getActiveRoadmap(Long userId) {
        return roadmapRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, "ACTIVE");
    }

    public LearningRoadmap getRoadmapById(Long roadmapId, Long userId) {
        LearningRoadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new IllegalArgumentException("Roadmap not found with id: " + roadmapId));

        if (!roadmap.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to this learning roadmap.");
        }

        return roadmap;
    }

    @Transactional
    public RoadmapTask toggleTaskCompletion(Long taskId, Long userId, Boolean isCompleted) {
        RoadmapTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));

        LearningRoadmap roadmap = task.getMilestone().getRoadmap();
        if (!roadmap.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to modify this task.");
        }

        task.setIsCompleted(isCompleted != null ? isCompleted : !Boolean.TRUE.equals(task.getIsCompleted()));
        task = taskRepository.save(task);

        // Recalculate roadmap progress
        recalculateRoadmapProgress(roadmap);

        return task;
    }

    @Transactional
    public void recalculateRoadmapProgress(LearningRoadmap roadmap) {
        List<RoadmapMilestone> milestones = milestoneRepository.findByRoadmapIdOrderByWeekNumberAscOrderIndexAsc(roadmap.getId());
        int totalTasks = 0;
        int completedTasks = 0;

        for (RoadmapMilestone milestone : milestones) {
            List<RoadmapTask> tasks = taskRepository.findByMilestoneIdOrderByOrderIndexAsc(milestone.getId());
            for (RoadmapTask t : tasks) {
                totalTasks++;
                if (Boolean.TRUE.equals(t.getIsCompleted())) {
                    completedTasks++;
                }
            }
        }

        int percentage = totalTasks > 0 ? (int) Math.round(((double) completedTasks / totalTasks) * 100) : 0;
        roadmap.setProgressPercentage(percentage);
        if (percentage >= 100) {
            roadmap.setStatus("COMPLETED");
        } else {
            roadmap.setStatus("ACTIVE");
        }
        roadmapRepository.save(roadmap);
    }

    public String askAssistant(User user, AiAssistantRequest request) {
        String skillContext = request.getContextSkill() != null ? request.getContextSkill() : "General Career Development";

        String prompt = """
        You are the SkillBridge AI Career Learning Tutor.
        A candidate is studying and needs your expert guidance.

        Candidate Name: %s
        Topic / Skill in Context: %s
        Candidate's Question:
        "%s"

        Provide a clear, engaging, step-by-step response.
        - Explain the concept simply with practical examples.
        - If applicable, show clean, idiomatic code snippets.
        - Highlight common beginner mistakes or gotchas to watch out for.
        - Suggest an immediate practical exercise to test understanding.
        Format cleanly with markdown.
        """.formatted(user.getFullName(), skillContext, request.getQuestion());

        return geminiAiService.generate(prompt);
    }
}
