package com.example.backend.controllers;
import com.example.backend.config.JwtService;
import com.example.backend.database.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserController
{
    @Autowired
    UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    @GetMapping
    public ResponseEntity<User> sayHello(Authentication authentication)
    {
        Optional<User> user = userRepository.findByEmail(authentication.getName());
        return ResponseEntity.ok(user.get());
    }
    @PutMapping("/edit")
    public ResponseEntity<Response> editUser(@RequestBody EdituserDTO editedDetails)
    {
        Optional<User> existinguser = userRepository.findById(editedDetails.getId());
        var user= User.builder()
                .id(editedDetails.getId())
                .firstname(editedDetails.getFirstname())
                .lastname(editedDetails.getLastname())
                .email(editedDetails.getEmail())
                .password(passwordEncoder.encode(existinguser.get().getPassword()))
                .role(Role.USER)
                .otp(null)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return ResponseEntity.ok(Response.builder().text(jwtToken).build());
    }

}
