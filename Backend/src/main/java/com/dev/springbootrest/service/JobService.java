package com.dev.springbootrest.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.dev.springbootrest.exception.ForbiddenException;
import com.dev.springbootrest.model.JobPost;
import com.dev.springbootrest.model.User;
import com.dev.springbootrest.repo.JobRepo;
import com.dev.springbootrest.repo.UserRepo;

@Service
public class JobService {

    @Autowired
    private JobRepo repo;

    @Autowired
    private UserRepo userRepo;


    // =========================
    // GET ALL JOBS
    // =========================

    public List<JobPost> getAllJobs() {

        return repo.findAll();
    }


    // =========================
    // ADD JOB
    // =========================

    public void addJob(JobPost jobPost) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = authentication.getName();

        User user = userRepo.findByUsername(username);

        if (user == null) {
            throw new ForbiddenException("User not found");
        }


        // =========================
        // ADMIN CAN POST
        // =========================

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {

            jobPost.setPostedBy(username);

            repo.save(jobPost);

            return;
        }


        // =========================
        // APPROVED RECRUITER CAN POST
        // =========================

        if ("RECRUITER".equalsIgnoreCase(user.getRole())
                && "APPROVED".equalsIgnoreCase(
                user.getRecruiterStatus())) {

            jobPost.setPostedBy(username);

            repo.save(jobPost);

            return;
        }


        // =========================
        // USER / PENDING RECRUITER
        // =========================

        throw new ForbiddenException(
                "You are not allowed to post jobs. Recruiter approval is required."
        );
    }


    // =========================
    // GET JOB BY ID
    // =========================

    public JobPost getJob(int postId) {

        return repo.findById(postId)
                .orElse(new JobPost());
    }


    // =========================
    // UPDATE JOB
    // =========================

    public void updateJob(JobPost jobPost) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = authentication.getName();

        User user = userRepo.findByUsername(username);

        if (user == null) {
            throw new ForbiddenException("User not found");
        }


        // =========================
        // ADMIN CAN UPDATE ANY JOB
        // =========================

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {

            repo.save(jobPost);

            return;
        }


        // =========================
        // APPROVED RECRUITER
        // =========================

        if ("RECRUITER".equalsIgnoreCase(user.getRole())
                && "APPROVED".equalsIgnoreCase(
                user.getRecruiterStatus())) {

            JobPost existingJob =
                    repo.findById(jobPost.getPostId())
                            .orElseThrow(() ->
                                    new ForbiddenException(
                                            "Job not found"
                                    )
                            );


            // Recruiter can update only own job
            if (!username.equals(existingJob.getPostedBy())) {

                throw new ForbiddenException(
                        "You can update only your own jobs."
                );
            }


            // Keep original owner
            jobPost.setPostedBy(username);

            repo.save(jobPost);

            return;
        }


        // =========================
        // NOT APPROVED
        // =========================

        throw new ForbiddenException(
                "You are not allowed to update jobs. Recruiter approval is required."
        );
    }


    // =========================
    // DELETE JOB
    // =========================

    public void deleteJob(int postId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = authentication.getName();

        User user = userRepo.findByUsername(username);

        if (user == null) {
            throw new ForbiddenException("User not found");
        }


        // =========================
        // ADMIN CAN DELETE ANY JOB
        // =========================

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {

            repo.deleteById(postId);

            return;
        }


        // =========================
        // APPROVED RECRUITER
        // =========================

        if ("RECRUITER".equalsIgnoreCase(user.getRole())
                && "APPROVED".equalsIgnoreCase(
                user.getRecruiterStatus())) {

            JobPost jobPost =
                    repo.findById(postId)
                            .orElseThrow(() ->
                                    new ForbiddenException(
                                            "Job not found"
                                    )
                            );


            // Recruiter can delete only own job
            if (!username.equals(jobPost.getPostedBy())) {

                throw new ForbiddenException(
                        "You can delete only your own jobs."
                );
            }


            repo.deleteById(postId);

            return;
        }


        // =========================
        // NOT APPROVED
        // =========================

        throw new ForbiddenException(
                "You are not allowed to delete jobs. Recruiter approval is required."
        );
    }


    // =========================
    // LOAD SAMPLE DATA
    // =========================

    public void load() {

        List<JobPost> jobs =
                new ArrayList<>(List.of(

                        new JobPost(
                                1,
                                "Software Engineer",
                                "Exciting opportunity for a skilled software engineer.",
                                3,
                                List.of(
                                        "Java",
                                        "Spring",
                                        "SQL",
                                        "API"
                                ),
                                "admin"
                        ),

                        new JobPost(
                                2,
                                "Data Scientist",
                                "Join our data science team and work on cutting-edge projects.",
                                5,
                                List.of(
                                        "Python",
                                        "Machine Learning",
                                        "TensorFlow",
                                        "API"
                                ),
                                "admin"
                        ),

                        new JobPost(
                                3,
                                "Frontend Developer",
                                "Create amazing user interfaces with our talented frontend team.",
                                2,
                                List.of(
                                        "JavaScript",
                                        "React",
                                        "CSS",
                                        "API"
                                ),
                                "admin"
                        ),

                        new JobPost(
                                4,
                                "Network Engineer",
                                "Design and maintain our robust network infrastructure.",
                                4,
                                List.of(
                                        "Cisco",
                                        "Routing",
                                        "Firewalls"
                                ),
                                "admin"
                        ),

                        new JobPost(
                                5,
                                "UX Designer",
                                "Shape the user experience with your creative design skills.",
                                3,
                                List.of(
                                        "UI/UX Design",
                                        "Adobe XD",
                                        "Prototyping"
                                ),
                                "admin"
                        )

                ));

        repo.saveAll(jobs);
    }


    // =========================
    // SEARCH JOB
    // =========================

    public List<JobPost> search(String keyword) {

        return repo.findByPostProfileContainingOrPostDescContaining(
                keyword,
                keyword
        );
    }
}