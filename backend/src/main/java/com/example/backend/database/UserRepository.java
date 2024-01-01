package com.example.backend.database;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Integer id);
    Optional<User> findByOtp(String Token);
}
