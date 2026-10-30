package com.tushar.SkillSync.dto;

import jakarta.validation.constraints.NotBlank;

public class RoadmapGenerateRequest {

    @NotBlank(message = "Target job role is required")
    private String targetJobRole;

    private String experienceLevel = "Mid-Level";
    private Integer weeklyHours = 10;
    private String learningStyle = "Project-based";
    private String customNotes;

    public RoadmapGenerateRequest() {}

    public String getTargetJobRole() { return targetJobRole; }
    public void setTargetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public Integer getWeeklyHours() { return weeklyHours; }
    public void setWeeklyHours(Integer weeklyHours) { this.weeklyHours = weeklyHours; }

    public String getLearningStyle() { return learningStyle; }
    public void setLearningStyle(String learningStyle) { this.learningStyle = learningStyle; }

    public String getCustomNotes() { return customNotes; }
    public void setCustomNotes(String customNotes) { this.customNotes = customNotes; }
}
