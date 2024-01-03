package com.example.backend.database;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository  extends JpaRepository<Recipe,Integer>
{
    Optional<List<Recipe>> findByUserId(Integer userId);
    Optional<Recipe> findById(Integer id);
    Optional<Recipe> findByName(String name);
}
