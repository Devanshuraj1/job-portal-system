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
    // RECRUITER + ADMIN
    // =====================================================

    @PostMapping("/jobPost")
    public ResponseEntity<?> addJob(
            @RequestBody JobPost jobPost,
            Authentication authentication) {

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        String username =
                authentication.getName();

        User user =
                userRepo.findByUsername(username);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }


        // ADMIN
        if ("ADMIN".equals(user.getRole())) {

            jobPost.setPostedBy(username);

            service.addJob(jobPost);

            return ResponseEntity.ok(jobPost);
        }


        // RECRUITER
        if ("RECRUITER".equals(user.getRole())) {

            if (!"APPROVED".equals(
                    user.getRecruiterStatus())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "Recruiter is not approved by Admin"
                        );
            }

            jobPost.setPostedBy(username);

            service.addJob(jobPost);

            return ResponseEntity.ok(jobPost);
        }


        // NORMAL USER
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                        "Only approved recruiters or admin can post jobs"
                );
    }


    // =====================================================
    // UPDATE JOB
    // RECRUITER + ADMIN
    //
    // IMPORTANT:
    // PUT /jobPost
    // postId request body ke andar jayega
    // =====================================================

    @PutMapping("/jobPost")
    public ResponseEntity<?> updateJob(
            @RequestBody JobPost jobPost,
            Authentication authentication) {

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        if (jobPost.getPostId() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Valid postId is required");
        }

        String username =
                authentication.getName();

        User user =
                userRepo.findByUsername(username);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }


        // =================================================
        // ADMIN CAN EDIT ANY JOB
        // =================================================

        if ("ADMIN".equals(user.getRole())) {

            service.updateJob(jobPost);

            return ResponseEntity.ok(
                    service.getJob(jobPost.getPostId())
            );
        }


        // =================================================
        // RECRUITER
        // =================================================

        if ("RECRUITER".equals(user.getRole())) {

            if (!"APPROVED".equals(
                    user.getRecruiterStatus())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "Recruiter is not approved by Admin"
                        );
            }


            JobPost existingJob =
                    service.getJob(
                            jobPost.getPostId()
                    );

            if (existingJob == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Job not found");
            }


            // Recruiter can edit only own job
            if (!username.equals(
                    existingJob.getPostedBy())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "You can edit only your own jobs"
                        );
            }


            // Keep original owner
            jobPost.setPostedBy(username);

            service.updateJob(jobPost);

            return ResponseEntity.ok(
                    service.getJob(jobPost.getPostId())
            );
        }


        // =================================================
        // NORMAL USER
        // =================================================

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                        "Only recruiter or admin can edit jobs"
                );
    }


    // =====================================================
    // DELETE JOB
    // RECRUITER + ADMIN
    // =====================================================

    @DeleteMapping("/jobPost/{postId}")
    public ResponseEntity<?> deleteJob(
            @PathVariable int postId,
            Authentication authentication) {

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        String username =
                authentication.getName();

        User user =
                userRepo.findByUsername(username);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }


        JobPost job =
                service.getJob(postId);

        if (job == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Job not found");
        }


        // ADMIN
        if ("ADMIN".equals(user.getRole())) {

            service.deleteJob(postId);

            return ResponseEntity.ok(
                    "Job deleted successfully"
            );
        }


        // RECRUITER
        if ("RECRUITER".equals(user.getRole())) {

            if (!"APPROVED".equals(
                    user.getRecruiterStatus())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "Recruiter is not approved by Admin"
                        );
            }


            if (!username.equals(
                    job.getPostedBy())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "You can delete only your own jobs"
                        );
            }

            service.deleteJob(postId);

            return ResponseEntity.ok(
                    "Job deleted successfully"
            );
        }


        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                        "Only recruiter or admin can delete jobs"
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