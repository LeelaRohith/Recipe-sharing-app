package com.example.backend.controllers;
import com.example.backend.database.Recipe;
import com.example.backend.database.RecipeRepository;
import com.example.backend.database.User;
import com.example.backend.database.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@CrossOrigin()
public class UserController
{
    @Autowired
    UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    @GetMapping
    public ResponseEntity<User> sayHello(Authentication authentication)
    {
        Optional<User> user = userRepository.findByEmail(authentication.getName());
        return ResponseEntity.ok(user.get());
    }



}
