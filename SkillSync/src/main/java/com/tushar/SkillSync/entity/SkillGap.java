package com.tushar.SkillSync.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_gaps")
public class SkillGap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String targetRole;

    @Column(nullable = false)
    private String skillName;

    @Column(nullable = false)
    private String category; // "DEMONSTRATED", "NEEDS_IMPROVEMENT", "NOT_DEMONSTRATED"

    private String importance; // "CRITICAL", "HIGH", "MEDIUM", "LOW"
    private String currentProficiency; // "None", "Beginner", "Intermediate", "Advanced"
    private String desiredProficiency; // "Intermediate", "Advanced", "Expert"
    private String priority; // "High", "Medium", "Low"

    @Lob
    @Column(columnDefinition = "CLOB")
    private String prerequisites;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String recommendedAction;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SkillGap() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }

    public String getCurrentProficiency() { return currentProficiency; }
    public void setCurrentProficiency(String currentProficiency) { this.currentProficiency = currentProficiency; }

    public String getDesiredProficiency() { return desiredProficiency; }
    public void setDesiredProficiency(String desiredProficiency) { this.desiredProficiency = desiredProficiency; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getPrerequisites() { return prerequisites; }
    public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }

    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
