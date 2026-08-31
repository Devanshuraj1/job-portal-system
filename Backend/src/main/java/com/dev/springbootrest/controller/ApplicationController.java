package com.dev.springbootrest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.springbootrest.model.JobApplication;
import com.dev.springbootrest.service.JobApplicationService;


@RestController
@RequestMapping("/applications")
@CrossOrigin(
        origins = "http://localhost:3001",
        allowCredentials = "true"
)
public class ApplicationController {


    @Autowired
    private JobApplicationService applicationService;


    // =====================================================
    // APPLY FOR JOB
    // USER ONLY
    // =====================================================

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyForJob(
            @PathVariable int jobId,
            Authentication authentication) {

        try {

            // Get username from JWT
            String username =
                    authentication.getName();


            JobApplication application =
                    applicationService.applyForJob(
                            jobId,
                            username
                    );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(application);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET MY APPLICATIONS
    // =====================================================

    @GetMapping("/my")
    public ResponseEntity<List<JobApplication>>
    getMyApplications(
            Authentication authentication) {

        String username =
                authentication.getName();


        return ResponseEntity.ok(
                applicationService
                        .getUserApplications(username)
        );
    }


    // =====================================================
    // GET APPLICANTS OF A JOB
    // RECRUITER / ADMIN
    // =====================================================

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>>
    getJobApplicants(
            @PathVariable int jobId) {

        return ResponseEntity.ok(
                applicationService
                        .getJobApplicants(jobId)
        );
    }


    // =====================================================
    // GET ALL APPLICATIONS
    // ADMIN
    // =====================================================

    @GetMapping
    public ResponseEntity<List<JobApplication>>
    getAllApplications() {

        return ResponseEntity.ok(
                applicationService
                        .getAllApplications()
        );
    }
}