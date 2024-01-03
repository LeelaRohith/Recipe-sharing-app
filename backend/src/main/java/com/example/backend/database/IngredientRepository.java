package com.example.backend.database;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredients,Integer>
{
    Optional<List<Ingredients>> findByRecipeId(Integer recipe_id);
    void deleteByRecipeId(Integer recipe_id);
}
