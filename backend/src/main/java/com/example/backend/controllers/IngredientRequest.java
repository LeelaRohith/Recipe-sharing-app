package com.example.backend.controllers;

import com.example.backend.database.Ingredients;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@CrossOrigin
public class IngredientRequest {
    List<String> ingredients;
}
