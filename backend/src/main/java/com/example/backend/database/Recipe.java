package com.example.backend.database;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@CrossOrigin
public class Recipe {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String date;
    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    @Lob
    @Column(name = "cookingInstructions", columnDefinition = "TEXT")
    private String cookingInstructions;
    private String image;
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ingredients> ingredients;
    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;
}
