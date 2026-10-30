package com.tushar.SkillSync.dto;

public class JobApplicationRequest {

    private String status = "SAVED"; // SAVED, APPLIED, INTERVIEWING, OFFERED, REJECTED
    private String notes;

    public JobApplicationRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
