package com.dev.springbootrest.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_application")
public class JobApplication {

    // =====================================================
    // ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    // =====================================================
    // JOB ID
    // =====================================================

    @Column(name = "job_id", nullable = false)
    private int jobId;


    // =====================================================
    // USERNAME
    // =====================================================

    @Column(name = "username", nullable = false)
    private String username;


    // =====================================================
    // APPLICATION DATE
    // =====================================================

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;


    // =====================================================
    // APPLICATION STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApplicationStatus status;


    // =====================================================
    // RESUME FILE
    // =====================================================

    @Column(name = "resume_file")
    private String resumeFile;


    // =====================================================
    // RESUME MATCH PERCENTAGE
    // =====================================================

    @Column(name = "match_percentage")
    private Integer matchPercentage;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // Required by JPA
    // =====================================================

    public JobApplication() {
    }


    // =====================================================
    // APPLICATION CONSTRUCTOR
    // =====================================================

    public JobApplication(
            int jobId,
            String username,
            String resumeFile,
            int matchPercentage) {

        this.jobId = jobId;
        this.username = username;
        this.appliedAt = LocalDateTime.now();
        this.status = ApplicationStatus.APPLIED;
        this.resumeFile = resumeFile;
        this.matchPercentage = matchPercentage;
    }


    // =====================================================
    // GET ID
    // =====================================================

    public int getId() {
        return id;
    }


    // =====================================================
    // SET ID
    // =====================================================

    public void setId(int id) {
        this.id = id;
    }


    // =====================================================
    // GET JOB ID
    // =====================================================

    public int getJobId() {
        return jobId;
    }


    // =====================================================
    // SET JOB ID
    // =====================================================

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }


    // =====================================================
    // GET USERNAME
    // =====================================================

    public String getUsername() {
        return username;
    }


    // =====================================================
    // SET USERNAME
    // =====================================================

    public void setUsername(String username) {
        this.username = username;
    }


    // =====================================================
    // GET APPLIED AT
    // =====================================================

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }


    // =====================================================
    // SET APPLIED AT
    // =====================================================

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }


    // =====================================================
    // GET STATUS
    // =====================================================

    public ApplicationStatus getStatus() {
        return status;
    }


    // =====================================================
    // SET STATUS
    // =====================================================

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }


    // =====================================================
    // GET RESUME FILE
    // =====================================================

    public String getResumeFile() {
        return resumeFile;
    }


    // =====================================================
    // SET RESUME FILE
    // =====================================================

    public void setResumeFile(String resumeFile) {
        this.resumeFile = resumeFile;
    }


    // =====================================================
    // GET MATCH PERCENTAGE
    // =====================================================

    public Integer getMatchPercentage() {
        return matchPercentage;
    }


    // =====================================================
    // SET MATCH PERCENTAGE
    // =====================================================

    public void setMatchPercentage(Integer matchPercentage) {
        this.matchPercentage = matchPercentage;
    }
}