package com.tushar.SkillSync.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    private String location;
    private String employmentType; // Full-time, Remote, Hybrid, Contract
    private String experienceLevel; // Entry, Mid-Level, Senior

    @Lob
    @Column(columnDefinition = "CLOB")
    private String description;

    @Column(length = 2000)
    private String requiredSkills;

    private String salaryRange;
    private Boolean isLive = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Job() {}

    public Job(String title, String company, String location, String employmentType, String experienceLevel, String description, String requiredSkills, String salaryRange) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.employmentType = employmentType;
        this.experienceLevel = experienceLevel;
        this.description = description;
        this.requiredSkills = requiredSkills;
        this.salaryRange = salaryRange;
        this.isLive = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public Boolean getIsLive() { return isLive; }
    public void setIsLive(Boolean live) { isLive = live; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
