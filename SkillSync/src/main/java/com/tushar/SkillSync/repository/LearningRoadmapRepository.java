package com.tushar.SkillSync.repository;

import com.tushar.SkillSync.entity.LearningRoadmap;
import com.tushar.SkillSync.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, Long> {
    List<LearningRoadmap> findByUserOrderByCreatedAtDesc(User user);
    List<LearningRoadmap> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<LearningRoadmap> findFirstByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
}
