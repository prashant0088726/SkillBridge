package com.tushar.SkillSync.service;

import com.tushar.SkillSync.dto.CandidateDashboardDto;
import com.tushar.SkillSync.dto.UserProfileDto;
import com.tushar.SkillSync.entity.*;
import com.tushar.SkillSync.repository.JobApplicationRepository;
import com.tushar.SkillSync.repository.ResumeAnalysisRepository;
import com.tushar.SkillSync.repository.ResumeRepository;
import com.tushar.SkillSync.repository.SkillGapRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DashboardService {

    private final ProfileService profileService;
    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository analysisRepository;
    private final RoadmapService roadmapService;
    private final SkillGapRepository skillGapRepository;
    private final JobApplicationRepository applicationRepository;

    public DashboardService(ProfileService profileService,
                            ResumeRepository resumeRepository,
                            ResumeAnalysisRepository analysisRepository,
                            RoadmapService roadmapService,
                            SkillGapRepository skillGapRepository,
                            JobApplicationRepository applicationRepository) {
        this.profileService = profileService;
        this.resumeRepository = resumeRepository;
        this.analysisRepository = analysisRepository;
        this.roadmapService = roadmapService;
        this.skillGapRepository = skillGapRepository;
        this.applicationRepository = applicationRepository;
    }

    public CandidateDashboardDto getDashboardData(User user) {
        CandidateDashboardDto dto = new CandidateDashboardDto();
        dto.setCandidateName(user.getFullName());

        UserProfileDto profile = profileService.getProfileByUserId(user.getId());
        dto.setTargetJobRole(profile.getTargetJobRole());
        dto.setProfileCompletionPercentage(profile.getProfileCompletionPercentage());

        // Recent score
        Optional<ResumeAnalysis> recentAnalysis = analysisRepository.findFirstByUserIdOrderByCreatedAtDesc(user.getId());
        if (recentAnalysis.isPresent()) {
            dto.setRecentResumeScore(recentAnalysis.get().getScore());
            dto.setRecentResumeScoreType("ATS_CHECK".equalsIgnoreCase(recentAnalysis.get().getAnalysisType()) ? "ATS Match" : "Resume Quality");
        }

        // Active roadmap
        Optional<LearningRoadmap> activeRoadmap = roadmapService.getActiveRoadmap(user.getId());
        if (activeRoadmap.isPresent()) {
            dto.setActiveRoadmap(activeRoadmap.get());

            // Find next uncompleted task
            for (RoadmapMilestone milestone : activeRoadmap.get().getMilestones()) {
                for (RoadmapTask task : milestone.getTasks()) {
                    if (!Boolean.TRUE.equals(task.getIsCompleted())) {
                        dto.setNextRecommendedTask(task);
                        break;
                    }
                }
                if (dto.getNextRecommendedTask() != null) break;
            }
        }

        // Top skill gaps
        List<SkillGap> gaps = skillGapRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        dto.setTopSkillGaps(gaps.stream().limit(5).toList());

        // Counts
        dto.setTotalResumesCount(resumeRepository.findByUserIdOrderByUploadedAtDesc(user.getId()).size());
        dto.setTotalAppliedJobsCount(applicationRepository.findByUserIdOrderByAppliedAtDesc(user.getId()).size());

        return dto;
    }
}
