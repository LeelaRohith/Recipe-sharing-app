package com.example.backend.controllers;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class editRecipeDTO
{
    private Integer id;
    private String name;
    private String date;
    private String description;
    private String cookingInstructions;
    private String image;
}
