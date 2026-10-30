package com.tushar.SkillSync.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @Column(nullable = false)
    private String analysisType; // "RESUME_REVIEW" or "ATS_CHECK"

    private Integer score; // 1-10 for review, 0-100 for ATS

    @Lob
    @Column(columnDefinition = "CLOB")
    private String keySkillsJson;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String improvementsJson;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String summary;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String matchedKeywordsJson;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String missingKeywordsJson;

    private String targetJobTitle;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String jobDescription;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ResumeAnalysis() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }

    public String getAnalysisType() { return analysisType; }
    public void setAnalysisType(String analysisType) { this.analysisType = analysisType; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getKeySkillsJson() { return keySkillsJson; }
    public void setKeySkillsJson(String keySkillsJson) { this.keySkillsJson = keySkillsJson; }

    public String getImprovementsJson() { return improvementsJson; }
    public void setImprovementsJson(String improvementsJson) { this.improvementsJson = improvementsJson; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getMatchedKeywordsJson() { return matchedKeywordsJson; }
    public void setMatchedKeywordsJson(String matchedKeywordsJson) { this.matchedKeywordsJson = matchedKeywordsJson; }

    public String getMissingKeywordsJson() { return missingKeywordsJson; }
    public void setMissingKeywordsJson(String missingKeywordsJson) { this.missingKeywordsJson = missingKeywordsJson; }

    public String getTargetJobTitle() { return targetJobTitle; }
    public void setTargetJobTitle(String targetJobTitle) { this.targetJobTitle = targetJobTitle; }

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
