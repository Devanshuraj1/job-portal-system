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


    // =========================
    // GET ALL JOBS
    // Public
    // =========================

    @GetMapping("/jobPosts")
    public List<JobPost> getAllJobs() {
        return service.getAllJobs();
    }


    // =========================
    // GET SINGLE JOB
    // Public
    // =========================

    @GetMapping("/jobPost/{postId}")
    public JobPost getJob(@PathVariable int postId) {
        return service.getJob(postId);
    }


    // =========================
    // SEARCH JOB
    // Public
    // =========================

    @GetMapping("/jobPosts/keyword/{keyword}")
    public List<JobPost> searchByKeyword(
            @PathVariable String keyword) {

        return service.search(keyword);
    }


    // =========================
    // ADD JOB
    // RECRUITER + ADMIN
    // =========================

    @PostMapping("/jobPost")
    public ResponseEntity<?> addJob(
            @RequestBody JobPost jobPost,
            Authentication authentication) {

        // Get logged-in username from JWT
        String username = authentication.getName();

        // Find user in database
        User user = userRepo.findByUsername(username);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }


        // ADMIN can directly post job
        if ("ADMIN".equals(user.getRole())) {

            service.addJob(jobPost);

            return ResponseEntity.ok(
                    service.getJob(jobPost.getPostId())
            );
        }


        // Recruiter check
        if ("RECRUITER".equals(user.getRole())) {

            // Check recruiter approval
            if (!"APPROVED".equals(user.getRecruiterStatus())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body("Recruiter is not approved by Admin");
            }

            // Approved recruiter can post
            service.addJob(jobPost);

            return ResponseEntity.ok(
                    service.getJob(jobPost.getPostId())
            );
        }


        // Normal USER cannot post
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Only approved recruiters or admin can post jobs");
    }


    // =========================
    // UPDATE JOB
    // =========================

    @PutMapping("/jobPost")
    public JobPost updateJob(
            @RequestBody JobPost jobPost) {

        service.updateJob(jobPost);

        return service.getJob(jobPost.getPostId());
    }


    // =========================
    // DELETE JOB
    // =========================

    @DeleteMapping("/jobPost/{postId}")
    public String deleteJob(@PathVariable int postId) {

        service.deleteJob(postId);

        return "Deleted";
    }


    // =========================
    // LOAD DATA
    // =========================

    @GetMapping("/load")
    public String loadData() {

        service.load();

        return "success";
    }
}