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
    private int postId;

    private String postProfile;

    private String postDesc;

    private Integer reqExperience;

    @ElementCollection
    @CollectionTable(
            name = "job_post_tech_stack",
            joinColumns = @JoinColumn(name = "post_id")
    )
    @Column(name = "tech_stack")
    private List<String> postTechStack;

    // Username of recruiter/admin who created the job
    private String postedBy;


    // =========================
    // OLD CONSTRUCTOR
    // =========================

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


    // =========================
    // NEW CONSTRUCTOR
    // =========================

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
}