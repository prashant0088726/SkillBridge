package com.tushar.SkillSync.repository;

import com.tushar.SkillSync.entity.CandidateProfile;
import com.tushar.SkillSync.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUser(User user);
    Optional<CandidateProfile> findByUserId(Long userId);
}
