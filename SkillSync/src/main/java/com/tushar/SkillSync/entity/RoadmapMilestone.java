package com.tushar.SkillSync.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roadmap_milestones")
public class RoadmapMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    @JsonIgnore
    private LearningRoadmap roadmap;

    private Integer weekNumber;
    private String title;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String description;

    private Integer estimatedHours;
    private Integer orderIndex;

    @OneToMany(mappedBy = "milestone", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<RoadmapTask> tasks = new ArrayList<>();

    public RoadmapMilestone() {}

    public void addTask(RoadmapTask task) {
        tasks.add(task);
        task.setMilestone(this);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LearningRoadmap getRoadmap() { return roadmap; }
    public void setRoadmap(LearningRoadmap roadmap) { this.roadmap = roadmap; }

    public Integer getWeekNumber() { return weekNumber; }
    public void setWeekNumber(Integer weekNumber) { this.weekNumber = weekNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public List<RoadmapTask> getTasks() { return tasks; }
    public void setTasks(List<RoadmapTask> tasks) { this.tasks = tasks; }
}
