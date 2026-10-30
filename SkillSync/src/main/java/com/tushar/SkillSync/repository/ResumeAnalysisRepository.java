package com.tushar.SkillSync.repository;

import com.tushar.SkillSync.entity.ResumeAnalysis;
import com.tushar.SkillSync.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findByUserOrderByCreatedAtDesc(User user);
    List<ResumeAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<ResumeAnalysis> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}
