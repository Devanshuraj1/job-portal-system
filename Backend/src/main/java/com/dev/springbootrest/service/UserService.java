package com.dev.springbootrest.service;

import org.springframework.beans.factory.annotation.Autowired;
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
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    // Register User
    public User register(User user) {

        // Never allow public registration as ADMIN
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Admin registration is not allowed");
        }

        // Normal Job Seeker
        if ("USER".equalsIgnoreCase(user.getRole())) {

            user.setRole("USER");
            user.setRecruiterStatus("NOT_APPLICABLE");
        }

        // Recruiter
        else if ("RECRUITER".equalsIgnoreCase(user.getRole())) {

            user.setRole("RECRUITER");
            user.setRecruiterStatus("PENDING");
        }

        // Invalid role
        else {
            throw new RuntimeException("Invalid role");
        }

        // Encrypt password
        user.setPassword(encoder.encode(user.getPassword()));

        return repo.save(user);
    }

    // Login User
    public String verify(User user) {

        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()
                )
        );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        return jwtService.generateToken(userDetails);
    }

}