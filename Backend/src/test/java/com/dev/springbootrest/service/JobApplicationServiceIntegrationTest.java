package com.dev.springbootrest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import com.dev.springbootrest.model.JobApplication;
import com.dev.springbootrest.model.JobPost;
import com.dev.springbootrest.repo.JobApplicationRepo;
import com.dev.springbootrest.repo.JobRepo;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:integrationdb",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "MAIL_TO=test@example.com"
})
@Transactional
class JobApplicationServiceIntegrationTest {

    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private JobRepo jobRepo;

    @Autowired
    private JobApplicationRepo applicationRepo;

    @BeforeEach
    void cleanDatabase() {
        applicationRepo.deleteAll();
        jobRepo.deleteAll();
    }

    @Test
    void shouldApplyForJobAndSaveApplication() {
        JobPost job = new JobPost();
        job.setCompanyName("Test Company");
        job.setPostProfile("Java Developer");
        job.setPostDesc("Backend developer");
        job.setReqExperience(2);
        job.setPostTechStack(List.of("Java", "Spring Boot"));
        job.setPostedBy("recruiter@test.com");

        JobPost savedJob = jobRepo.save(job);

        JobApplication application = jobApplicationService.applyForJob(
                savedJob.getPostId(),
                "user@test.com",
                "resume.pdf",
                "Java Spring Boot developer with 2 years experience"
        );

        assertNotNull(application.getId());
        assertEquals(savedJob.getPostId(), application.getJobId());
        assertEquals("user@test.com", application.getUsername());
        assertEquals("resume.pdf", application.getResumeFile());
        assertEquals(100, application.getMatchPercentage());
    }

    @Test
    void shouldReturnUserApplications() {
        JobPost job = new JobPost();
        job.setCompanyName("Test Company");
        job.setPostProfile("Java Developer");
        job.setPostDesc("Backend developer");
        job.setReqExperience(2);
        job.setPostTechStack(List.of("Java"));
        job.setPostedBy("recruiter@test.com");

        JobPost savedJob = jobRepo.save(job);

        jobApplicationService.applyForJob(
                savedJob.getPostId(),
                "user@test.com",
                "resume.pdf",
                "Java developer with 2 years experience"
        );

        List<JobApplication> applications =
                jobApplicationService.getUserApplications("user@test.com");

        assertEquals(1, applications.size());
        assertEquals("user@test.com", applications.get(0).getUsername());
    }
}
