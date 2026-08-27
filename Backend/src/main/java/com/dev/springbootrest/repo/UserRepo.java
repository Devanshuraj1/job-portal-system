package com.dev.springbootrest.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.springbootrest.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

    // Find user by username
    User findByUsername(String username);

    // Find pending recruiters
    List<User> findByRoleAndRecruiterStatus(
            String role,
            String recruiterStatus
    );
}