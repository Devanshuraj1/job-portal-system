package com.dev.springbootrest.model;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "job_post")
public class JobPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private int postId;


    // =====================================================
    // JOB BASIC DETAILS
    // =====================================================

    @Column(name = "company_name")
    private String companyName;


    @Column(name = "post_profile")
    private String postProfile;


    @Column(
            name = "post_desc",
            columnDefinition = "TEXT"
    )
    private String postDesc;


    @Column(name = "req_experience")
    private Integer reqExperience;


    @Column(name = "salary")
    private String salary;


    @Column(name = "workplace")
    private String workplace;


    @Column(name = "job_type")
    private String jobType;


    // =====================================================
    // TECHNICAL SKILLS
    // =====================================================

    @ElementCollection
    @CollectionTable(
            name = "job_post_tech_stack",
            joinColumns = @JoinColumn(name = "post_id")
    )
    @Column(name = "tech_stack")
    private List<String> postTechStack;


    // =====================================================
    // JOB OWNER
    // =====================================================

    @Column(name = "posted_by")
    private String postedBy;


    // =====================================================
    // OLD CONSTRUCTOR
    // =====================================================

    public JobPost(
            int postId,
            String postProfile,
            String postDesc,
            Integer reqExperience,
            List<String> postTechStack) {

        this.postId = postId;
        this.postProfile = postProfile;
        this.postDesc = postDesc;
        this.reqExperience = reqExperience;
        this.postTechStack = postTechStack;
    }


    // =====================================================
    // CONSTRUCTOR WITH OWNER
    // =====================================================

    public JobPost(
            int postId,
            String postProfile,
            String postDesc,
            Integer reqExperience,
            List<String> postTechStack,
            String postedBy) {

        this.postId = postId;
        this.postProfile = postProfile;
        this.postDesc = postDesc;
        this.reqExperience = reqExperience;
        this.postTechStack = postTechStack;
        this.postedBy = postedBy;
    }


    // =====================================================
    // FULL CONSTRUCTOR
    // =====================================================

    public JobPost(
            int postId,
            String companyName,
            String postProfile,
            String postDesc,
            Integer reqExperience,
            String salary,
            String workplace,
            String jobType,
            List<String> postTechStack,
            String postedBy) {

        this.postId = postId;
        this.companyName = companyName;
        this.postProfile = postProfile;
        this.postDesc = postDesc;
        this.reqExperience = reqExperience;
        this.salary = salary;
        this.workplace = workplace;
        this.jobType = jobType;
        this.postTechStack = postTechStack;
        this.postedBy = postedBy;
    }
}