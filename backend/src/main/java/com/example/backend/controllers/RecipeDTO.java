package com.example.backend.controllers;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDTO {
    private Integer id;
    private String name;
    private String date;
    private String description;
    private String cookingInstructions;
    private String image;
    private List<IngredientsDTO> ingredients;
    // Other fields as needed
}
