package com.tushar.SkillSync.dto;

public class TaskStatusRequest {
    private Boolean isCompleted;

    public TaskStatusRequest() {}
    public TaskStatusRequest(Boolean isCompleted) { this.isCompleted = isCompleted; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }
}
