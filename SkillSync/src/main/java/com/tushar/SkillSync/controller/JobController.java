package com.tushar.SkillSync.controller;

import com.tushar.SkillSync.dto.ApiResponse;
import com.tushar.SkillSync.dto.JobApplicationRequest;
import com.tushar.SkillSync.entity.Job;
import com.tushar.SkillSync.entity.JobApplication;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Job>>> getJobs(@RequestParam(name = "search", required = false) String search) {
        List<Job> jobs = jobService.getAllJobs(search);
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable("id") Long id) {
        Job job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.ok(job));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApiResponse<JobApplication>> applyOrSaveJob(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Long jobId,
            @RequestBody(required = false) JobApplicationRequest request
    ) {
        if (request == null) {
            request = new JobApplicationRequest();
        }
        JobApplication application = jobService.applyOrSaveJob(user, jobId, request);
        return ResponseEntity.ok(ApiResponse.ok("Job application updated", application));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getUserApplications(@AuthenticationPrincipal User user) {
        List<JobApplication> applications = jobService.getUserApplications(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(applications));
    }
}
