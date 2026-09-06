package com.dev.springbootrest.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.springbootrest.model.ApplicationStatus;
import com.dev.springbootrest.model.JobApplication;
import com.dev.springbootrest.model.JobPost;
import com.dev.springbootrest.repo.JobApplicationRepo;
import com.dev.springbootrest.repo.JobRepo;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepo applicationRepo;

    @Autowired
    private JobRepo jobRepo;

    @Autowired
    private ResumeMatchingService resumeMatchingService;


    // =====================================================
    // APPLY FOR JOB
    // =====================================================

    public JobApplication applyForJob(
            int jobId,
            String username, String resumeFile, String resumeText) {

        // -------------------------------------------------
        // 1. Check whether job exists
        // -------------------------------------------------

        if (!jobRepo.existsById(jobId)) {

            throw new RuntimeException(
                    "Job not found"
            );
        }


        // -------------------------------------------------
        // 2. Check duplicate application
        // -------------------------------------------------

        boolean alreadyApplied =
                applicationRepo
                        .existsByJobIdAndUsername(
                                jobId,
                                username
                        );

        if (alreadyApplied) {

            throw new RuntimeException(
                    "You have already applied for this job"
            );
        }


        // -------------------------------------------------
        // 3. Create application
        // -------------------------------------------------

        JobPost job = jobRepo.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        int matchPercentage = resumeMatchingService.calculate(job, resumeText);

        JobApplication application =
                new JobApplication(jobId, username, resumeFile, matchPercentage);


        // -------------------------------------------------
        // 4. Save application
        // -------------------------------------------------

        return applicationRepo.save(
                application
        );
    }


    // =====================================================
    // GET USER APPLICATIONS
    // =====================================================

    public List<JobApplication> getUserApplications(
            String username) {

        return applicationRepo.findByUsername(
                username
        );
    }


    // =====================================================
    // GET JOB APPLICANTS
    // =====================================================

    public List<JobApplication> getJobApplicants(
            int jobId) {

        return applicationRepo.findByJobId(
                jobId
        );
    }


    // =====================================================
    // GET ALL APPLICATIONS
    // ADMIN
    // =====================================================

    public List<JobApplication> getAllApplications() {

        return applicationRepo.findAll();
    }


    // =====================================================
    // UPDATE APPLICATION STATUS
    // RECRUITER
    // =====================================================

    public JobApplication updateApplicationStatus(
            int applicationId,
            ApplicationStatus newStatus,
            String recruiterUsername) {


        // -------------------------------------------------
        // 1. Find application
        // -------------------------------------------------

        JobApplication application =
                applicationRepo
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );


        // -------------------------------------------------
        // 2. Find the job
        // -------------------------------------------------

        JobPost job =
                jobRepo
                        .findById(application.getJobId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );


        // -------------------------------------------------
        // 3. Check job ownership
        // -------------------------------------------------

        if (!job.getPostedBy()
                .equals(recruiterUsername)) {

            throw new RuntimeException(
                    "You can only update applications for your own jobs"
            );
        }


        // -------------------------------------------------
        // 4. Update status
        // -------------------------------------------------

        application.setStatus(newStatus);


        // -------------------------------------------------
        // 5. Save updated application
        // -------------------------------------------------

        return applicationRepo.save(
                application
        );
    }
}