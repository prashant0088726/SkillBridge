package com.tushar.SkillSync.repository;

import com.tushar.SkillSync.entity.SkillGap;
import com.tushar.SkillSync.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillGapRepository extends JpaRepository<SkillGap, Long> {
    List<SkillGap> findByUserOrderByCreatedAtDesc(User user);
    List<SkillGap> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<SkillGap> findByUserIdAndTargetRole(Long userId, String targetRole);
}
