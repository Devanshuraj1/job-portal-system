package com.dev.springbootrest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.springbootrest.model.User;
import com.dev.springbootrest.repo.UserRepo;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    @Lazy
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;

    private BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder(12);


    // =========================
    // REGISTER USER
    // =========================

    public User register(User user) {

        // Admin registration not allowed
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {

            throw new RuntimeException(
                    "Admin registration is not allowed"
            );
        }


        // =========================
        // NORMAL USER
        // =========================

        if ("USER".equalsIgnoreCase(user.getRole())) {

            user.setRole("USER");

            user.setRecruiterStatus(
                    "NOT_APPLICABLE"
            );
        }


        // =========================
        // RECRUITER
        // =========================

        else if ("RECRUITER".equalsIgnoreCase(user.getRole())) {

            user.setRole("RECRUITER");

            user.setRecruiterStatus(
                    "PENDING"
            );
        }


        // =========================
        // INVALID ROLE
        // =========================

        else {

            throw new RuntimeException(
                    "Invalid role"
            );
        }


        // =========================
        // ENCRYPT PASSWORD
        // =========================

        user.setPassword(
                encoder.encode(user.getPassword())
        );


        return repo.save(user);
    }


    // =========================
    // NORMAL LOGIN
    // =========================

    public String verify(User user) {

        // Find user first
        User existingUser =
                repo.findByUsername(
                        user.getUsername()
                );


        // User doesn't exist
        if (existingUser == null) {

            throw new RuntimeException(
                    "Invalid username or password"
            );
        }


        // =========================
        // RECRUITER STATUS CHECK
        // =========================

        if ("RECRUITER".equalsIgnoreCase(
                existingUser.getRole())) {


            // PENDING
            if ("PENDING".equalsIgnoreCase(
                    existingUser.getRecruiterStatus())) {

                throw new RuntimeException(
                        "Recruiter account is pending admin approval"
                );
            }


            // REJECTED
            if ("REJECTED".equalsIgnoreCase(
                    existingUser.getRecruiterStatus())) {

                throw new RuntimeException(
                        "Recruiter account has been rejected"
                );
            }

        }


        // =========================
        // AUTHENTICATE
        // =========================

        Authentication authentication =
                authManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                user.getPassword()
                        )
                );


        UserDetails userDetails =
                (UserDetails)
                        authentication.getPrincipal();


        // =========================
        // GENERATE JWT
        // =========================

        return jwtService.generateToken(
                userDetails
        );
    }


    // =====================================================
    // GOOGLE LOGIN
    // =====================================================

    public String verifyGoogleUser(String email) {

        // =========================
        // CHECK EMAIL
        // =========================

        if (email == null || email.isBlank()) {

            throw new RuntimeException(
                    "Google account email not found"
            );
        }


        // Normalize email
        email = email.trim().toLowerCase();


        // =========================
        // FIND EXISTING USER
        // =========================

        User existingUser =
                repo.findByUsername(email);


        // =========================
        // CREATE USER IF NOT EXISTS
        // =========================

        if (existingUser == null) {

            User newUser = new User();

            newUser.setUsername(email);

            // Random password because Google
            // authentication doesn't use our password
            newUser.setPassword(
                    encoder.encode(
                            java.util.UUID.randomUUID().toString()
                    )
            );

            newUser.setRole("USER");

            newUser.setRecruiterStatus(
                    "NOT_APPLICABLE"
            );

            existingUser = repo.save(newUser);
        }


        // =========================
        // RECRUITER STATUS CHECK
        // =========================

        if ("RECRUITER".equalsIgnoreCase(
                existingUser.getRole())) {


            // PENDING
            if ("PENDING".equalsIgnoreCase(
                    existingUser.getRecruiterStatus())) {

                throw new RuntimeException(
                        "Recruiter account is pending admin approval"
                );
            }


            // REJECTED
            if ("REJECTED".equalsIgnoreCase(
                    existingUser.getRecruiterStatus())) {

                throw new RuntimeException(
                        "Recruiter account has been rejected"
                );
            }
        }


        // =========================
        // CREATE USER DETAILS
        // =========================

        UserDetails userDetails =
                new com.dev.springbootrest.model.UserPrincipal(
                        existingUser
                );


        // =========================
        // GENERATE OUR EXISTING JWT
        // =========================

        return jwtService.generateToken(
                userDetails
        );
    }
}