package com.tushar.SkillSync.service;

import com.tushar.SkillSync.dto.JobApplicationRequest;
import com.tushar.SkillSync.entity.Job;
import com.tushar.SkillSync.entity.JobApplication;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.repository.JobApplicationRepository;
import com.tushar.SkillSync.repository.JobRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, JobApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @PostConstruct
    public void seedJobsIfEmpty() {
        if (jobRepository.count() == 0) {
            jobRepository.save(new Job(
                    "Junior Java & Spring Boot Developer",
                    "Nexus Cloud Systems",
                    "Remote / New York, NY",
                    "Full-time",
                    "Entry / Junior",
                    "Looking for a motivated Java developer to build and maintain cloud REST microservices. You will collaborate with senior engineers to design REST APIs, write unit tests, and integrate PostgreSQL databases.",
                    "Java 21, Spring Boot, REST APIs, PostgreSQL, Docker, Git, JUnit",
                    "$75,000 - $95,000"
            ));

            jobRepository.save(new Job(
                    "Full-Stack Software Engineer (React + Java)",
                    "Apex FinTech Solutions",
                    "Hybrid / Austin, TX",
                    "Full-time",
                    "Mid-Level",
                    "Join our core banking technology team building customer-facing financial dashboards and robust transaction backends. You will develop modern web interfaces in React and scalable backend services with Spring Boot.",
                    "React 18, TypeScript, Java, Spring Boot, Spring Security, MySQL, AWS",
                    "$115,000 - $140,000"
            ));

            jobRepository.save(new Job(
                    "AI Integration & Backend Engineer",
                    "CognitivePath Labs",
                    "Remote / San Francisco, CA",
                    "Full-time",
                    "Mid-Level",
                    "Help us integrate LLMs and generative AI workflows into enterprise HR and recruitment systems. Experience with Spring AI, LangChain, or direct Gemini/OpenAI API integration is highly valued.",
                    "Java, Spring AI, Google Gemini API, Python, Vector Databases, REST APIs",
                    "$130,000 - $160,000"
            ));

            jobRepository.save(new Job(
                    "Frontend Developer (React / Next.js)",
                    "Vanguard Digital",
                    "Remote",
                    "Contract",
                    "Junior / Mid-Level",
                    "Seeking a passionate frontend developer to craft accessible, highly responsive web applications using React, modern CSS tokens, and state management.",
                    "React, JavaScript (ES6+), CSS3/Flexbox/Grid, REST API integration, Git",
                    "$80,000 - $100,000"
            ));

            jobRepository.save(new Job(
                    "DevOps & Cloud Infrastructure Engineer",
                    "HyperScale Cloud",
                    "Remote / Seattle, WA",
                    "Full-time",
                    "Senior",
                    "Lead cloud automation, CI/CD pipeline deployments, and container orchestration across multi-region Kubernetes clusters.",
                    "Docker, Kubernetes, AWS, Terraform, CI/CD, Linux, Monitoring",
                    "$145,000 - $175,000"
            ));
        }
    }

    public List<Job> getAllJobs(String search) {
        if (search != null && !search.trim().isBlank()) {
            return jobRepository.searchJobs(search.trim());
        }
        return jobRepository.findByIsLiveTrueOrderByCreatedAtDesc();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with id: " + id));
    }

    @Transactional
    public JobApplication applyOrSaveJob(User user, Long jobId, JobApplicationRequest request) {
        Job job = getJobById(jobId);

        JobApplication application = applicationRepository.findByUserIdAndJobId(user.getId(), jobId)
                .orElseGet(() -> new JobApplication(user, job, request.getStatus() != null ? request.getStatus() : "SAVED"));

        if (request.getStatus() != null) {
            application.setStatus(request.getStatus());
        }
        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        return applicationRepository.save(application);
    }

    public List<JobApplication> getUserApplications(Long userId) {
        return applicationRepository.findByUserIdOrderByAppliedAtDesc(userId);
    }
}
