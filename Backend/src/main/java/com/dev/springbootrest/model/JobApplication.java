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

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@Entity
@Table(name = "job_application")
public class JobApplication {

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

    @Column(name = "resume_file")
    private String resumeFile;

    @Column(name = "match_percentage")
    private Integer matchPercentage;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public JobApplication(
            int jobId,
            String username, String resumeFile, int matchPercentage) {

        this.jobId = jobId;
        this.username = username;
        this.appliedAt = LocalDateTime.now();
        this.status = ApplicationStatus.APPLIED;
        this.resumeFile = resumeFile;
        this.matchPercentage = matchPercentage;
    }
}