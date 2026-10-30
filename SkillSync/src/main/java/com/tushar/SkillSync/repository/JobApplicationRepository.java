package com.tushar.SkillSync.repository;

import com.tushar.SkillSync.entity.JobApplication;
import com.tushar.SkillSync.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUserOrderByAppliedAtDesc(User user);
    List<JobApplication> findByUserIdOrderByAppliedAtDesc(Long userId);
    Optional<JobApplication> findByUserIdAndJobId(Long userId, Long jobId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
