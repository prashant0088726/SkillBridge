package com.tushar.SkillSync.repository;

import com.tushar.SkillSync.entity.Resume;
import com.tushar.SkillSync.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserOrderByUploadedAtDesc(User user);
    List<Resume> findByUserIdOrderByUploadedAtDesc(Long userId);
}
