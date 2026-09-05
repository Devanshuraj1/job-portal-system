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


    // =====================================================
    // GET ALL JOBS
    // =====================================================

    public List<JobPost> getAllJobs() {

        return repo.findAll();
    }


    // =====================================================
    // GET MY JOBS
    // RECRUITER
    // =====================================================

    public List<JobPost> getMyJobs(String username) {

        return repo.findByPostedBy(username);
    }


    // =====================================================
    // ADD JOB
    // =====================================================

    public void addJob(JobPost jobPost) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null) {

            throw new ForbiddenException(
                    "User is not authenticated"
            );
        }


        String username =
                authentication.getName();


        User user =
                userRepo.findByUsername(username);


        if (user == null) {

            throw new ForbiddenException(
                    "User not found"
            );
        }


        // =================================================
        // ADMIN
        // =================================================

        if ("ADMIN".equalsIgnoreCase(
                user.getRole())) {

            jobPost.setPostId(0);

            jobPost.setPostedBy(
                    username
            );

            repo.save(jobPost);

            return;
        }


        // =================================================
        // APPROVED RECRUITER
        // =================================================

        if (
                "RECRUITER".equalsIgnoreCase(
                        user.getRole()
                )
                        &&
                        "APPROVED".equalsIgnoreCase(
                                user.getRecruiterStatus()
                        )
        ) {

            jobPost.setPostId(0);

            jobPost.setPostedBy(
                    username
            );

            repo.save(jobPost);

            return;
        }


        // =================================================
        // NOT ALLOWED
        // =================================================

        throw new ForbiddenException(
                "You are not allowed to post jobs. Recruiter approval is required."
        );
    }


    // =====================================================
    // GET JOB BY ID
    // =====================================================

    public JobPost getJob(int postId) {

        return repo.findById(postId)
                .orElse(null);
    }


    // =====================================================
    // UPDATE JOB
    // =====================================================

    public void updateJob(JobPost jobPost) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null) {

            throw new ForbiddenException(
                    "User is not authenticated"
            );
        }


        String username =
                authentication.getName();


        User user =
                userRepo.findByUsername(username);


        if (user == null) {

            throw new ForbiddenException(
                    "User not found"
            );
        }


        // =================================================
        // FIND EXISTING JOB
        // =================================================

        JobPost existingJob =
                repo.findById(
                                jobPost.getPostId()
                        )
                        .orElseThrow(() ->
                                new ForbiddenException(
                                        "Job not found"
                                )
                        );


        // =================================================
        // ADMIN CAN UPDATE ANY JOB
        // =================================================

        if ("ADMIN".equalsIgnoreCase(
                user.getRole())) {

            existingJob.setCompanyName(
                    jobPost.getCompanyName()
            );

            existingJob.setPostProfile(
                    jobPost.getPostProfile()
            );

            existingJob.setPostDesc(
                    jobPost.getPostDesc()
            );

            existingJob.setReqExperience(
                    jobPost.getReqExperience()
            );

            existingJob.setSalary(
                    jobPost.getSalary()
            );

            existingJob.setWorkplace(
                    jobPost.getWorkplace()
            );

            existingJob.setJobType(
                    jobPost.getJobType()
            );

            existingJob.setPostTechStack(
                    jobPost.getPostTechStack()
            );


            repo.save(existingJob);

            return;
        }


        // =================================================
        // APPROVED RECRUITER
        // =================================================

        if (
                "RECRUITER".equalsIgnoreCase(
                        user.getRole()
                )
                        &&
                        "APPROVED".equalsIgnoreCase(
                                user.getRecruiterStatus()
                        )
        ) {


            // -------------------------------------------------
            // OWNERSHIP CHECK
            // -------------------------------------------------

            if (
                    existingJob.getPostedBy() == null
                            ||
                            !username.equals(
                                    existingJob.getPostedBy()
                            )
            ) {

                throw new ForbiddenException(
                        "You can update only your own jobs."
                );
            }


            // -------------------------------------------------
            // UPDATE FIELDS
            // -------------------------------------------------

            existingJob.setCompanyName(
                    jobPost.getCompanyName()
            );

            existingJob.setPostProfile(
                    jobPost.getPostProfile()
            );

            existingJob.setPostDesc(
                    jobPost.getPostDesc()
            );

            existingJob.setReqExperience(
                    jobPost.getReqExperience()
            );

            existingJob.setSalary(
                    jobPost.getSalary()
            );

            existingJob.setWorkplace(
                    jobPost.getWorkplace()
            );

            existingJob.setJobType(
                    jobPost.getJobType()
            );

            existingJob.setPostTechStack(
                    jobPost.getPostTechStack()
            );


            // -------------------------------------------------
            // NEVER CHANGE OWNER
            // -------------------------------------------------

            existingJob.setPostedBy(
                    username
            );


            repo.save(existingJob);

            return;
        }


        // =================================================
        // NOT ALLOWED
        // =================================================

        throw new ForbiddenException(
                "You are not allowed to update jobs. Recruiter approval is required."
        );
    }


    // =====================================================
    // DELETE JOB
    // =====================================================

    public void deleteJob(int postId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null) {

            throw new ForbiddenException(
                    "User is not authenticated"
            );
        }


        String username =
                authentication.getName();


        User user =
                userRepo.findByUsername(username);


        if (user == null) {

            throw new ForbiddenException(
                    "User not found"
            );
        }


        // =================================================
        // ADMIN
        // =================================================

        if ("ADMIN".equalsIgnoreCase(
                user.getRole())) {

            if (!repo.existsById(postId)) {

                throw new ForbiddenException(
                        "Job not found"
                );
            }

            repo.deleteById(postId);

            return;
        }


        // =================================================
        // APPROVED RECRUITER
        // =================================================

        if (
                "RECRUITER".equalsIgnoreCase(
                        user.getRole()
                )
                        &&
                        "APPROVED".equalsIgnoreCase(
                                user.getRecruiterStatus()
                        )
        ) {


            JobPost jobPost =
                    repo.findById(postId)
                            .orElseThrow(() ->
                                    new ForbiddenException(
                                            "Job not found"
                                    )
                            );


            if (
                    jobPost.getPostedBy() == null
                            ||
                            !username.equals(
                                    jobPost.getPostedBy()
                            )
            ) {

                throw new ForbiddenException(
                        "You can delete only your own jobs."
                );
            }


            repo.deleteById(postId);

            return;
        }


        // =================================================
        // NOT ALLOWED
        // =================================================

        throw new ForbiddenException(
                "You are not allowed to delete jobs. Recruiter approval is required."
        );
    }


    // =====================================================
    // LOAD SAMPLE DATA
    // =====================================================

    public void load() {

        List<JobPost> jobs =
                new ArrayList<>(
                        List.of(

                                new JobPost(
                                        0,
                                        "JobPortal",
                                        "Software Engineer",
                                        "Exciting opportunity for a skilled software engineer.",
                                        3,
                                        "₹8-12 LPA",
                                        "REMOTE",
                                        "FULL_TIME",
                                        List.of(
                                                "Java",
                                                "Spring Boot",
                                                "SQL",
                                                "REST API"
                                        ),
                                        "admin"
                                ),


                                new JobPost(
                                        0,
                                        "DataTech",
                                        "Data Scientist",
                                        "Join our data science team and work on cutting-edge projects.",
                                        2,
                                        "₹10-15 LPA",
                                        "HYBRID",
                                        "FULL_TIME",
                                        List.of(
                                                "Python",
                                                "Machine Learning",
                                                "TensorFlow",
                                                "SQL"
                                        ),
                                        "admin"
                                ),


                                new JobPost(
                                        0,
                                        "WebWorks",
                                        "Frontend Developer",
                                        "Create amazing user interfaces with our talented frontend team.",
                                        1,
                                        "₹5-8 LPA",
                                        "ON_SITE",
                                        "FULL_TIME",
                                        List.of(
                                                "JavaScript",
                                                "React",
                                                "CSS",
                                                "HTML"
                                        ),
                                        "admin"
                                )

                        )
                );


        repo.saveAll(jobs);
    }


    // =====================================================
    // SEARCH JOB
    // =====================================================

    public List<JobPost> search(
            String keyword) {

        return repo
                .findByPostProfileContainingOrPostDescContaining(
                        keyword,
                        keyword
                );
    }
}