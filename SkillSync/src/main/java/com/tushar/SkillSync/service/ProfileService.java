package com.tushar.SkillSync.service;

import com.tushar.SkillSync.dto.UserProfileDto;
import com.tushar.SkillSync.entity.CandidateProfile;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.repository.CandidateProfileRepository;
import com.tushar.SkillSync.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(CandidateProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public UserProfileDto getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> profileRepository.save(new CandidateProfile(user)));

        return toDto(user, profile);
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UserProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        if (dto.getFullName() != null && !dto.getFullName().isBlank()) {
            user.setFullName(dto.getFullName().trim());
            userRepository.save(user);
        }

        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> new CandidateProfile(user));

        if (dto.getTargetJobRole() != null) profile.setTargetJobRole(dto.getTargetJobRole());
        if (dto.getExperienceLevel() != null) profile.setExperienceLevel(dto.getExperienceLevel());
        if (dto.getWeeklyHoursAvailable() != null) profile.setWeeklyHoursAvailable(dto.getWeeklyHoursAvailable());
        if (dto.getLearningStyle() != null) profile.setLearningStyle(dto.getLearningStyle());
        if (dto.getLocation() != null) profile.setLocation(dto.getLocation());
        if (dto.getBio() != null) profile.setBio(dto.getBio());
        if (dto.getTechnicalSkills() != null) profile.setTechnicalSkills(dto.getTechnicalSkills());
        if (dto.getEducation() != null) profile.setEducation(dto.getEducation());
        if (dto.getWorkExperience() != null) profile.setWorkExperience(dto.getWorkExperience());
        if (dto.getCareerInterests() != null) profile.setCareerInterests(dto.getCareerInterests());

        profile = profileRepository.save(profile);
        return toDto(user, profile);
    }

    public int calculateProfileCompletion(User user, CandidateProfile profile) {
        if (profile == null) return 20;

        int points = 0;
        int totalPoints = 8;

        if (user.getFullName() != null && !user.getFullName().isBlank()) points++;
        if (profile.getTargetJobRole() != null && !profile.getTargetJobRole().isBlank()) points++;
        if (profile.getExperienceLevel() != null && !profile.getExperienceLevel().isBlank()) points++;
        if (profile.getLocation() != null && !profile.getLocation().isBlank()) points++;
        if (profile.getBio() != null && !profile.getBio().isBlank()) points++;
        if (profile.getTechnicalSkills() != null && !profile.getTechnicalSkills().isBlank()) points++;
        if (profile.getEducation() != null && !profile.getEducation().isBlank()) points++;
        if (profile.getWorkExperience() != null && !profile.getWorkExperience().isBlank()) points++;

        return (int) Math.round(((double) points / totalPoints) * 100);
    }

    private UserProfileDto toDto(User user, CandidateProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setTargetJobRole(profile.getTargetJobRole());
        dto.setExperienceLevel(profile.getExperienceLevel());
        dto.setWeeklyHoursAvailable(profile.getWeeklyHoursAvailable());
        dto.setLearningStyle(profile.getLearningStyle());
        dto.setLocation(profile.getLocation());
        dto.setBio(profile.getBio());
        dto.setTechnicalSkills(profile.getTechnicalSkills());
        dto.setEducation(profile.getEducation());
        dto.setWorkExperience(profile.getWorkExperience());
        dto.setCareerInterests(profile.getCareerInterests());
        dto.setProfileCompletionPercentage(calculateProfileCompletion(user, profile));
        return dto;
    }
}
