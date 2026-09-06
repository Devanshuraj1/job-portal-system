package com.dev.springbootrest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.springbootrest.model.User;
import com.dev.springbootrest.repo.UserRepo;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class AdminController {

    @Autowired
    private UserRepo userRepo;



    // GET ALL PENDING RECRUITERS


    @GetMapping("/recruiters/pending")
    public ResponseEntity<List<User>> getPendingRecruiters() {

        List<User> recruiters =
                userRepo.findByRoleAndRecruiterStatus(
                        "RECRUITER",
                        "PENDING"
                );

        return ResponseEntity.ok(recruiters);
    }



    // APPROVE RECRUITER


    @PutMapping("/recruiters/{id}/approve")
    public ResponseEntity<?> approveRecruiter(
            @PathVariable int id) {

        User user = userRepo.findById(id)
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }


        if (!"RECRUITER".equalsIgnoreCase(
                user.getRole())) {

            return ResponseEntity
                    .badRequest()
                    .body("User is not a recruiter");
        }


        user.setRecruiterStatus("APPROVED");

        userRepo.save(user);


        return ResponseEntity.ok(
                "Recruiter approved successfully"
        );
    }



    // REJECT RECRUITER

    @PutMapping("/recruiters/{id}/reject")
    public ResponseEntity<?> rejectRecruiter(
            @PathVariable int id) {

        User user = userRepo.findById(id)
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }


        if (!"RECRUITER".equalsIgnoreCase(
                user.getRole())) {

            return ResponseEntity
                    .badRequest()
                    .body("User is not a recruiter");
        }


        user.setRecruiterStatus("REJECTED");

        userRepo.save(user);


        return ResponseEntity.ok(
                "Recruiter rejected successfully"
        );
    }
}
