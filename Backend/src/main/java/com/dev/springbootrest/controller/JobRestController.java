package com.dev.springbootrest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dev.springbootrest.model.JobPost;
import com.dev.springbootrest.model.User;
import com.dev.springbootrest.repo.UserRepo;
import com.dev.springbootrest.service.JobService;

@RestController
@CrossOrigin(
        origins = "http://localhost:3001",
        allowCredentials = "true"
)
public class JobRestController {

    @Autowired
    private JobService service;

    @Autowired
    private UserRepo userRepo;


    // =====================================================
    // GET ALL JOBS
    // PUBLIC
    // =====================================================

    @GetMapping("/jobPosts")
    public List<JobPost> getAllJobs() {

        return service.getAllJobs();
    }


    // =====================================================
    // GET MY JOBS
    // RECRUITER
    // =====================================================

    @GetMapping("/jobPosts/my")
    public ResponseEntity<?> getMyJobs(
            Authentication authentication) {

        // -------------------------------------------------
        // Check authentication
        // -------------------------------------------------

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }


        // -------------------------------------------------
        // Get logged-in username
        // -------------------------------------------------

        String username =
                authentication.getName();


        // -------------------------------------------------
        // Find user
        // -------------------------------------------------

        User user =
                userRepo.findByUsername(username);


        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }


        // -------------------------------------------------
        // Check role
        // -------------------------------------------------

        if (!"RECRUITER".equalsIgnoreCase(
                user.getRole())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "Only recruiters can access their jobs"
                    );
        }


        // -------------------------------------------------
        // Check recruiter approval
        // -------------------------------------------------

        if (!"APPROVED".equalsIgnoreCase(
                user.getRecruiterStatus())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "Recruiter is not approved by Admin"
                    );
        }


        // -------------------------------------------------
        // Return recruiter's jobs
        // -------------------------------------------------

        return ResponseEntity.ok(
                service.getMyJobs(username)
        );
    }


    // =====================================================
    // GET SINGLE JOB
    // PUBLIC
    // =====================================================

    @GetMapping("/jobPost/{postId}")
    public JobPost getJob(
            @PathVariable int postId) {

        return service.getJob(postId);
    }


    // =====================================================
    // SEARCH JOB
    // PUBLIC
    // =====================================================

    @GetMapping("/jobPosts/keyword/{keyword}")
    public List<JobPost> searchByKeyword(
            @PathVariable String keyword) {

        return service.search(keyword);
    }


    // =====================================================
    // ADD JOB
    // ADMIN + APPROVED RECRUITER
    // =====================================================

    @PostMapping("/jobPost")
    public ResponseEntity<?> addJob(
            @RequestBody JobPost jobPost,
            Authentication authentication) {

        String username =
                authentication.getName();

        User user =
                userRepo.findByUsername(username);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }


        // -------------------------------------------------
        // ADMIN
        // -------------------------------------------------

        if ("ADMIN".equalsIgnoreCase(
                user.getRole())) {

            jobPost.setPostedBy(username);

            service.addJob(jobPost);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            service.getJob(
                                    jobPost.getPostId()
                            )
                    );
        }


        // -------------------------------------------------
        // RECRUITER
        // -------------------------------------------------

        if ("RECRUITER".equalsIgnoreCase(
                user.getRole())) {

            if (!"APPROVED".equalsIgnoreCase(
                    user.getRecruiterStatus())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "Recruiter is not approved by Admin"
                        );
            }


            // Always set owner
            // from logged-in user

            jobPost.setPostedBy(username);

            service.addJob(jobPost);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            service.getJob(
                                    jobPost.getPostId()
                            )
                    );
        }


        // -------------------------------------------------
        // NORMAL USER
        // -------------------------------------------------

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                        "Only Admin or approved Recruiter can post jobs"
                );
    }


    // =====================================================
    // UPDATE JOB
    //
    // ADMIN     -> ANY JOB
    // RECRUITER -> ONLY OWN JOB
    // USER      -> NO ACCESS
    // =====================================================

    @PutMapping("/jobPost")
    public ResponseEntity<?> updateJob(
            @RequestBody JobPost jobPost,
            Authentication authentication) {

        // -------------------------------------------------
        // Validate authentication
        // -------------------------------------------------

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Please login first"
                    );
        }


        // -------------------------------------------------
        // Logged-in username
        // -------------------------------------------------

        String username =
                authentication.getName();


        // -------------------------------------------------
        // Find logged-in user
        // -------------------------------------------------

        User user =
                userRepo.findByUsername(username);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "User not found"
                    );
        }


        // -------------------------------------------------
        // Find existing job
        // -------------------------------------------------

        JobPost existingJob;

        try {

            existingJob =
                    service.getJob(
                            jobPost.getPostId()
                    );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "Job not found"
                    );
        }


        if (existingJob == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "Job not found"
                    );
        }


        // =================================================
        // ADMIN
        // =================================================

        if ("ADMIN".equalsIgnoreCase(
                user.getRole())) {

            /*
             * ADMIN CAN EDIT ANY JOB.
             *
             * Preserve original owner.
             */

            jobPost.setPostedBy(
                    existingJob.getPostedBy()
            );

            service.updateJob(jobPost);

            return ResponseEntity.ok(
                    service.getJob(
                            jobPost.getPostId()
                    )
            );
        }


        // =================================================
        // RECRUITER
        // =================================================

        if ("RECRUITER".equalsIgnoreCase(
                user.getRole())) {

            // Recruiter must be approved

            if (!"APPROVED".equalsIgnoreCase(
                    user.getRecruiterStatus())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "Recruiter is not approved by Admin"
                        );
            }


            // -------------------------------------------------
            // Ownership check
            // -------------------------------------------------

            String owner =
                    existingJob.getPostedBy();


            if (owner == null ||
                    !owner.equals(username)) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "You can edit only your own job posts"
                        );
            }


            // Preserve owner

            jobPost.setPostedBy(username);

            service.updateJob(jobPost);

            return ResponseEntity.ok(
                    service.getJob(
                            jobPost.getPostId()
                    )
            );
        }


        // =================================================
        // NORMAL USER
        // =================================================

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                        "Users are not allowed to edit jobs"
                );
    }


    // =====================================================
    // DELETE JOB
    //
    // ADMIN     -> ANY JOB
    // RECRUITER -> ONLY OWN JOB
    // USER      -> NO ACCESS
    // =====================================================

    @DeleteMapping("/jobPost/{postId}")
    public ResponseEntity<?> deleteJob(
            @PathVariable int postId,
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Please login first"
                    );
        }


        String username =
                authentication.getName();


        User user =
                userRepo.findByUsername(username);


        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "User not found"
                    );
        }


        JobPost existingJob;

        try {

            existingJob =
                    service.getJob(postId);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "Job not found"
                    );
        }


        if (existingJob == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "Job not found"
                    );
        }


        // =================================================
        // ADMIN
        // =================================================

        if ("ADMIN".equalsIgnoreCase(
                user.getRole())) {

            service.deleteJob(postId);

            return ResponseEntity.ok(
                    "Job deleted successfully"
            );
        }


        // =================================================
        // RECRUITER
        // =================================================

        if ("RECRUITER".equalsIgnoreCase(
                user.getRole())) {

            if (!"APPROVED".equalsIgnoreCase(
                    user.getRecruiterStatus())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "Recruiter is not approved by Admin"
                        );
            }


            String owner =
                    existingJob.getPostedBy();


            if (owner == null ||
                    !owner.equals(username)) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "You can delete only your own job posts"
                        );
            }


            service.deleteJob(postId);

            return ResponseEntity.ok(
                    "Job deleted successfully"
            );
        }


        // =================================================
        // USER
        // =================================================

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                        "Users are not allowed to delete jobs"
                );
    }


    // =====================================================
    // LOAD DATA
    // =====================================================

    @GetMapping("/load")
    public String loadData() {

        service.load();

        return "success";
    }
}