package com.dev.springbootrest.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.springbootrest.model.User;
import com.dev.springbootrest.repo.UserRepo;

@Service
public class AdminService {

    @Autowired
    private UserRepo userRepo;


    // =========================
    // GET PENDING RECRUITERS
    // =========================

    public List<User> getPendingRecruiters() {

        return userRepo.findByRoleAndRecruiterStatus(
                "RECRUITER",
                "PENDING"
        );
    }


    // =========================
    // APPROVE RECRUITER
    // =========================

    public User approveRecruiter(int id) {

        User user = userRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (!"RECRUITER".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException(
                    "User is not a recruiter"
            );
        }

        user.setRecruiterStatus("APPROVED");

        return userRepo.save(user);
    }


    // =========================
    // REJECT RECRUITER
    // =========================

    public User rejectRecruiter(int id) {

        User user = userRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (!"RECRUITER".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException(
                    "User is not a recruiter"
            );
        }

        user.setRecruiterStatus("REJECTED");

        return userRepo.save(user);
    }
}