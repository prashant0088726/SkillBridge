package com.tushar.SkillSync.repository;

import com.tushar.SkillSync.entity.RoadmapMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapMilestoneRepository extends JpaRepository<RoadmapMilestone, Long> {
    List<RoadmapMilestone> findByRoadmapIdOrderByWeekNumberAscOrderIndexAsc(Long roadmapId);
}
