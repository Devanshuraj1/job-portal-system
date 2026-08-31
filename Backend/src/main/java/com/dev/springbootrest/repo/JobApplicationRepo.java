package com.dev.springbootrest.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.springbootrest.model.JobApplication;


@Repository
public interface JobApplicationRepo
        extends JpaRepository<JobApplication, Integer> {


    // Check duplicate application
    boolean existsByJobIdAndUsername(
            int jobId,
            String username
    );


    // User's applications
    List<JobApplication> findByUsername(
            String username
    );


    // Applicants of a particular job
    List<JobApplication> findByJobId(
            int jobId
    );
}