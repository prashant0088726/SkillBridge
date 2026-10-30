package com.tushar.SkillSync.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String targetJobRole;
    private String experienceLevel; // Entry, Mid, Senior, Lead
    private Integer weeklyHoursAvailable = 10;
    private String learningStyle = "Project-based"; // Hands-on, Visual, Reading, Project-based
    private String location;

    @Column(length = 2000)
    private String bio;

    @Column(length = 4000)
    private String technicalSkills;

    @Column(length = 4000)
    private String education;

    @Column(length = 4000)
    private String workExperience;

    @Column(length = 2000)
    private String careerInterests;

    private LocalDateTime updatedAt;

    public CandidateProfile() {}

    public CandidateProfile(User user) {
        this.user = user;
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTargetJobRole() { return targetJobRole; }
    public void setTargetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public Integer getWeeklyHoursAvailable() { return weeklyHoursAvailable; }
    public void setWeeklyHoursAvailable(Integer weeklyHoursAvailable) { this.weeklyHoursAvailable = weeklyHoursAvailable; }

    public String getLearningStyle() { return learningStyle; }
    public void setLearningStyle(String learningStyle) { this.learningStyle = learningStyle; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(String technicalSkills) { this.technicalSkills = technicalSkills; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getWorkExperience() { return workExperience; }
    public void setWorkExperience(String workExperience) { this.workExperience = workExperience; }

    public String getCareerInterests() { return careerInterests; }
    public void setCareerInterests(String careerInterests) { this.careerInterests = careerInterests; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
