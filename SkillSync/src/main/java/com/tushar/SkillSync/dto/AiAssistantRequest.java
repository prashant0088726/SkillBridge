package com.tushar.SkillSync.dto;

import jakarta.validation.constraints.NotBlank;

public class AiAssistantRequest {

    private Long roadmapId;
    private Long taskId;
    private String contextSkill;

    @NotBlank(message = "Question or prompt cannot be empty")
    private String question;

    public AiAssistantRequest() {}

    public Long getRoadmapId() { return roadmapId; }
    public void setRoadmapId(Long roadmapId) { this.roadmapId = roadmapId; }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public String getContextSkill() { return contextSkill; }
    public void setContextSkill(String contextSkill) { this.contextSkill = contextSkill; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
