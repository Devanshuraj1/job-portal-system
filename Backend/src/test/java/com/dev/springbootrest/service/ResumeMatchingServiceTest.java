package com.dev.springbootrest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dev.springbootrest.model.JobPost;

class ResumeMatchingServiceTest {

    private ResumeMatchingService service;

    @BeforeEach
    void setUp() {
        service = new ResumeMatchingService();
    }

    @Test
    void shouldMatchAllSkills() {
        JobPost job = new JobPost();
        job.setPostTechStack(List.of("Java", "Spring Boot", "PostgreSQL"));

        int result = service.calculate(
                job,
                "Experienced Java developer with Spring Boot and PostgreSQL"
        );

        assertEquals(100, result);
    }

    @Test
    void shouldMatchHalfOfTheSkills() {
        JobPost job = new JobPost();
        job.setPostTechStack(List.of("Java", "Spring Boot", "React", "Docker"));

        int result = service.calculate(
                job,
                "Java and Spring Boot developer"
        );

        assertEquals(50, result);
    }

    @Test
    void shouldBeCaseInsensitive() {
        JobPost job = new JobPost();
        job.setPostTechStack(List.of("Java", "Spring Boot"));

        int result = service.calculate(
                job,
                "JAVA developer with SPRING BOOT experience"
        );

        assertEquals(100, result);
    }

    @Test
    void shouldCalculateSkillsAndExperience() {
        JobPost job = new JobPost();
        job.setPostTechStack(List.of("Java", "Spring Boot"));
        job.setReqExperience(4);

        int result = service.calculate(
                job,
                "Java Spring Boot developer with 2 years experience"
        );

        assertEquals(90, result);
    }

    @Test
    void shouldReturnExperienceScoreWhenNoSkillsAreRequired() {
        JobPost job = new JobPost();
        job.setPostTechStack(List.of());
        job.setReqExperience(4);

        int result = service.calculate(
                job,
                "Software developer with 2 years experience"
        );

        assertEquals(50, result);
    }

    @Test
    void shouldReturnZeroWhenNoSkillsMatch() {
        JobPost job = new JobPost();
        job.setPostTechStack(List.of("Java", "Spring Boot"));

        int result = service.calculate(
                job,
                "Python developer with Django experience"
        );

        assertEquals(0, result);
    }
}
