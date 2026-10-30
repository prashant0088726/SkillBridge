package com.tushar.SkillSync.dto;

import jakarta.validation.constraints.NotBlank;

public class SkillGapRequest {

    private Long resumeId;

    @NotBlank(message = "Target job role or job description is required")
    private String targetJobRole;

    private String jobDescription;

    public SkillGapRequest() {}

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    public String getTargetJobRole() { return targetJobRole; }
    public void setTargetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; }

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
}
