package com.tushar.SkillSync.dto;

public class UserProfileDto {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String targetJobRole;
    private String experienceLevel;
    private Integer weeklyHoursAvailable;
    private String learningStyle;
    private String location;
    private String bio;
    private String technicalSkills;
    private String education;
    private String workExperience;
    private String careerInterests;
    private Integer profileCompletionPercentage;

    public UserProfileDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public Integer getProfileCompletionPercentage() { return profileCompletionPercentage; }
    public void setProfileCompletionPercentage(Integer profileCompletionPercentage) { this.profileCompletionPercentage = profileCompletionPercentage; }
}
