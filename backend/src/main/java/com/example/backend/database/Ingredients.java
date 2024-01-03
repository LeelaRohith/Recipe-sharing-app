package com.example.backend.database;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Ingredients {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    @Lob
    @Column(name = "ingredient", columnDefinition = "TEXT")
    private String ingredient;
    @ManyToOne
    @JoinColumn(name="recipe_id")
    private Recipe recipe;
}
