package com.dev.springbootrest.controller;

import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dev.springbootrest.model.ApplicationStatus;
import com.dev.springbootrest.model.JobApplication;
import com.dev.springbootrest.model.JobPost;
import com.dev.springbootrest.repo.JobApplicationRepo;
import com.dev.springbootrest.repo.JobRepo;
import com.dev.springbootrest.service.JobApplicationService;
import com.dev.springbootrest.service.ResumeService;

@RestController
@RequestMapping("/applications")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://localhost:3001"
        },
        allowCredentials = "true"
)
public class ApplicationController {

    @Autowired
    private JobApplicationService applicationService;

    @Autowired
    private JobApplicationRepo applicationRepo;

    @Autowired
    private JobRepo jobRepo;

    @Autowired
    private ResumeService resumeService;


    // =========================================================
    // APPLY FOR JOB
    // =========================================================

    @PostMapping(
            value = "/apply/{jobId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> applyForJob(
            @PathVariable int jobId,
            @RequestParam("resume") MultipartFile resume,
            Authentication authentication) {

        try {

            if (authentication == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Please login first");
            }

            String username = authentication.getName();

            // Save uploaded resume
            String storedFilename =
                    resumeService.saveResume(resume);

            // Extract resume text
            String resumeText =
                    resumeService.extractText(storedFilename);

            // Calculate match percentage
            // and save application
            JobApplication application =
                    applicationService.applyForJob(
                            jobId,
                            username,
                            storedFilename,
                            resumeText
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(application);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // GET MY APPLICATIONS
    // =========================================================

    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(
            Authentication authentication) {

        try {

            if (authentication == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Please login first");
            }

            String username = authentication.getName();

            return ResponseEntity.ok(
                    applicationRepo.findByUsername(username)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // GET APPLICATIONS FOR ONE JOB
    // =========================================================

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicationsByJob(
            @PathVariable int jobId) {

        try {

            return ResponseEntity.ok(
                    applicationRepo.findByJobId(jobId)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // GET ALL APPLICATIONS
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getAllApplications() {

        try {

            return ResponseEntity.ok(
                    applicationRepo.findAll()
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // UPDATE APPLICATION STATUS
    // =========================================================

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable int applicationId,
            @RequestBody StatusRequest request) {

        try {

            if (request == null ||
                    request.getStatus() == null ||
                    request.getStatus().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Status is required");
            }


            JobApplication application =
                    applicationRepo.findById(applicationId)
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Application not found"
                                    )
                            );


            /*
             * Convert String to ApplicationStatus enum
             *
             * Example:
             * "SHORTLISTED"
             *      ->
             * ApplicationStatus.SHORTLISTED
             */
            ApplicationStatus newStatus =
                    ApplicationStatus.valueOf(
                            request.getStatus()
                                    .trim()
                                    .toUpperCase()
                    );


            application.setStatus(newStatus);


            JobApplication updated =
                    applicationRepo.save(application);


            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Invalid status. Use: APPLIED, SHORTLISTED, REJECTED, or HIRED"
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // VIEW / DOWNLOAD RESUME
    // =========================================================

    @GetMapping("/resume/{applicationId}")
    public ResponseEntity<?> getResume(
            @PathVariable int applicationId,
            Authentication authentication) {

        try {

            // -------------------------------------------------
            // Authentication check
            // -------------------------------------------------

            if (authentication == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Please login first");
            }


            // -------------------------------------------------
            // Find application
            // -------------------------------------------------

            JobApplication application =
                    applicationRepo.findById(applicationId)
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Application not found"
                                    )
                            );


            // -------------------------------------------------
            // Find related job
            // -------------------------------------------------

            JobPost job =
                    jobRepo.findById(
                            application.getJobId()
                    ).orElseThrow(
                            () -> new RuntimeException(
                                    "Job not found"
                            )
                    );


            // -------------------------------------------------
            // Logged-in user
            // -------------------------------------------------

            String loggedInUser =
                    authentication.getName();


            // -------------------------------------------------
            // Check applicant
            // -------------------------------------------------

            boolean isApplicant =
                    loggedInUser.equals(
                            application.getUsername()
                    );


            // -------------------------------------------------
            // Check recruiter
            // -------------------------------------------------

            boolean isRecruiter =
                    loggedInUser.equals(
                            job.getPostedBy()
                    );


            // -------------------------------------------------
            // Authorization
            // -------------------------------------------------

            if (!isApplicant && !isRecruiter) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "You are not authorized to view this resume"
                        );
            }


            // -------------------------------------------------
            // Get filename stored in database
            // -------------------------------------------------

            String resumeFile =
                    application.getResumeFile();


            if (resumeFile == null ||
                    resumeFile.trim().isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                "Resume was not uploaded for this application"
                        );
            }


            // -------------------------------------------------
            // Get physical file path
            // -------------------------------------------------

            Path path =
                    resumeService.getResumePath(
                            resumeFile
                    );


            // -------------------------------------------------
            // Debug information
            // -------------------------------------------------

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "RESUME REQUEST"
            );

            System.out.println(
                    "Application ID : " + applicationId
            );

            System.out.println(
                    "Logged user     : " + loggedInUser
            );

            System.out.println(
                    "DB filename     : " + resumeFile
            );

            System.out.println(
                    "Resume path     : "
                            + path.toAbsolutePath()
            );

            System.out.println(
                    "File exists     : "
                            + Files.exists(path)
            );

            System.out.println(
                    "======================================"
            );


            // -------------------------------------------------
            // Check file exists
            // -------------------------------------------------

            if (!Files.exists(path)) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                "Resume file not found on server: "
                                        + path.toAbsolutePath()
                        );
            }


            // -------------------------------------------------
            // Create resource
            // -------------------------------------------------

            FileSystemResource resource =
                    new FileSystemResource(path);


            String fileName =
                    path.getFileName().toString();


            String lowerName =
                    fileName.toLowerCase();


            // =================================================
            // PDF
            // =================================================

            if (lowerName.endsWith(".pdf")) {

                return ResponseEntity
                        .ok()
                        .contentType(
                                MediaType.APPLICATION_PDF
                        )
                        .header(
                                HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\""
                                        + fileName
                                        + "\""
                        )
                        .body(resource);
            }


            // =================================================
            // DOCX
            // =================================================

            if (lowerName.endsWith(".docx")) {

                MediaType docxType =
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        );

                return ResponseEntity
                        .ok()
                        .contentType(docxType)
                        .header(
                                HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\""
                                        + fileName
                                        + "\""
                        )
                        .body(resource);
            }


            // -------------------------------------------------
            // Unsupported file
            // -------------------------------------------------

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Unsupported resume format"
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Unable to open resume: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================================
    // STATUS REQUEST DTO
    // =========================================================

    public static class StatusRequest {

        private String status;


        public String getStatus() {
            return status;
        }


        public void setStatus(String status) {
            this.status = status;
        }
    }
}