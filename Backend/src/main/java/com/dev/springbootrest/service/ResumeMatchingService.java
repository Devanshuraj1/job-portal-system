package com.dev.springbootrest.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.dev.springbootrest.model.JobPost;

@Service
public class ResumeMatchingService {

    public int calculate(JobPost job, String resumeText) {

        String resume = normalize(resumeText);

        // ==============================
        // SKILL MATCHING
        // ==============================
        Set<String> requiredSkills = new LinkedHashSet<>();

        List<String> techStack = job.getPostTechStack();

        if (techStack != null) {
            requiredSkills = techStack.stream()
                    .filter(skill -> skill != null && !skill.isBlank())
                    .map(this::normalizeSkill)
                    .filter(skill -> skill.length() >= 2)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
        }

        int skillScore = 0;

        if (!requiredSkills.isEmpty()) {

            long matchedSkills = requiredSkills.stream()
                    .filter(resume::contains)
                    .count();

            skillScore = (int) Math.round(
                    matchedSkills * 100.0 / requiredSkills.size()
            );
        }

        // ==============================
        // EXPERIENCE MATCHING
        // ==============================
        int experienceScore = 0;

        Integer requiredExperience = job.getReqExperience();

        if (requiredExperience != null) {

            Integer candidateExperience = extractCandidateYears(resume);

            if (candidateExperience != null) {

                if (requiredExperience <= 0) {
                    experienceScore = 100;
                } else {

                    experienceScore = Math.min(
                            100,
                            (int) Math.round(
                                    candidateExperience * 100.0
                                            / requiredExperience
                            )
                    );
                }
            }
        }

        // ==============================
        // FINAL MATCH SCORE
        // ==============================

        if (requiredSkills.isEmpty()) {
            return experienceScore;
        }

        // Skills = 80%
        // Experience = 20%
        if (requiredExperience != null) {

            return (int) Math.round(
                    skillScore * 0.8
                            + experienceScore * 0.2
            );
        }

        return skillScore;
    }

    // ==============================
    // NORMALIZE RESUME TEXT
    // ==============================
    private String normalize(String text) {

        if (text == null) {
            return "";
        }

        return text
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9+#. ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    // ==============================
    // NORMALIZE SKILL
    // ==============================
    private String normalizeSkill(String skill) {

        return normalize(skill);
    }

    // ==============================
    // EXTRACT EXPERIENCE
    // ==============================
    private Integer extractCandidateYears(String text) {

        Pattern pattern = Pattern.compile(
                "(\\d+)\\s*(?:\\+\\s*)?(?:years?|yrs?)",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {

            try {
                return Integer.valueOf(matcher.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }

        return null;
    }
}