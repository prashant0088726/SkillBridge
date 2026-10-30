package com.tushar.SkillSync.repository;

import com.tushar.SkillSync.entity.RoadmapTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapTaskRepository extends JpaRepository<RoadmapTask, Long> {
    List<RoadmapTask> findByMilestoneIdOrderByOrderIndexAsc(Long milestoneId);
}
