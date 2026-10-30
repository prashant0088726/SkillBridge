package com.tushar.SkillSync.dto;

import com.tushar.SkillSync.entity.LearningRoadmap;
import com.tushar.SkillSync.entity.ResumeAnalysis;
import com.tushar.SkillSync.entity.RoadmapTask;
import com.tushar.SkillSync.entity.SkillGap;

import java.util.List;

public class CandidateDashboardDto {

    private String candidateName;
    private String targetJobRole;
    private Integer profileCompletionPercentage;
    private Integer recentResumeScore;
    private String recentResumeScoreType; // Review or ATS
    private LearningRoadmap activeRoadmap;
    private RoadmapTask nextRecommendedTask;
    private List<SkillGap> topSkillGaps;
    private long totalResumesCount;
    private long totalAppliedJobsCount;

    public CandidateDashboardDto() {}

    // Getters and Setters
    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getTargetJobRole() { return targetJobRole; }
    public void setTargetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; }

    public Integer getProfileCompletionPercentage() { return profileCompletionPercentage; }
    public void setProfileCompletionPercentage(Integer profileCompletionPercentage) { this.profileCompletionPercentage = profileCompletionPercentage; }

    public Integer getRecentResumeScore() { return recentResumeScore; }
    public void setRecentResumeScore(Integer recentResumeScore) { this.recentResumeScore = recentResumeScore; }

    public String getRecentResumeScoreType() { return recentResumeScoreType; }
    public void setRecentResumeScoreType(String recentResumeScoreType) { this.recentResumeScoreType = recentResumeScoreType; }

    public LearningRoadmap getActiveRoadmap() { return activeRoadmap; }
    public void setActiveRoadmap(LearningRoadmap activeRoadmap) { this.activeRoadmap = activeRoadmap; }

    public RoadmapTask getNextRecommendedTask() { return nextRecommendedTask; }
    public void setNextRecommendedTask(RoadmapTask nextRecommendedTask) { this.nextRecommendedTask = nextRecommendedTask; }

    public List<SkillGap> getTopSkillGaps() { return topSkillGaps; }
    public void setTopSkillGaps(List<SkillGap> topSkillGaps) { this.topSkillGaps = topSkillGaps; }

    public long getTotalResumesCount() { return totalResumesCount; }
    public void setTotalResumesCount(long totalResumesCount) { this.totalResumesCount = totalResumesCount; }

    public long getTotalAppliedJobsCount() { return totalAppliedJobsCount; }
    public void setTotalAppliedJobsCount(long totalAppliedJobsCount) { this.totalAppliedJobsCount = totalAppliedJobsCount; }
}
