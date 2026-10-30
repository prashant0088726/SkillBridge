package com.tushar.SkillSync.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roadmap_tasks")
public class RoadmapTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id", nullable = false)
    @JsonIgnore
    private RoadmapMilestone milestone;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String description;

    // THEORY, PRACTICE, MINI_PROJECT, PORTFOLIO_PROJECT, ASSESSMENT
    private String taskType = "PRACTICE";

    private Boolean isCompleted = false;
    private LocalDateTime completedAt;

    private String resourceTitle;
    private String resourceUrl;
    private Integer orderIndex = 0;

    public RoadmapTask() {}

    public RoadmapTask(String title, String description, String taskType, String resourceTitle, String resourceUrl) {
        this.title = title;
        this.description = description;
        this.taskType = taskType;
        this.resourceTitle = resourceTitle;
        this.resourceUrl = resourceUrl;
        this.isCompleted = false;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RoadmapMilestone getMilestone() { return milestone; }
    public void setMilestone(RoadmapMilestone milestone) { this.milestone = milestone; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean completed) {
        this.isCompleted = completed;
        if (Boolean.TRUE.equals(completed)) {
            this.completedAt = LocalDateTime.now();
        } else {
            this.completedAt = null;
        }
    }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getResourceTitle() { return resourceTitle; }
    public void setResourceTitle(String resourceTitle) { this.resourceTitle = resourceTitle; }

    public String getResourceUrl() { return resourceUrl; }
    public void setResourceUrl(String resourceUrl) { this.resourceUrl = resourceUrl; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
