package com.example.backend.controllers;

import com.example.backend.database.Recipe;
import com.example.backend.database.RecipeRepository;
import com.example.backend.database.User;
import com.example.backend.database.UserRepository;
import com.example.backend.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;
import java.io.*;
import java.util.*;

import static java.net.HttpURLConnection.HTTP_OK;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@CrossOrigin
public class RecipeController {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    @Autowired
    private S3Service s3Service;;




    @PostMapping("/addrecipe/{id}")
    public ResponseEntity<Response> addRecipe(@RequestBody Recipe recipe, @PathVariable Integer id)
    {
        Optional<User> user = userRepository.findById(id);
        recipe.setUser(user.get());

        recipeRepository.save(recipe);
        return ResponseEntity.ok(Response.builder().text("Recipe Added Successfully").build());
    }


    @GetMapping("/currentuserrecipes/{id}")
    public ResponseEntity<List<Recipe>> getCurrentUserRecipes(@PathVariable Integer id)
    {
        Optional<List<Recipe>> l = recipeRepository.findByUserId(id);
        return ResponseEntity.ok(l.get());
    }
    @GetMapping("/allrecipes")
    public ResponseEntity<List<Recipe>> getallRecipes()
    {
        List<Recipe> l =recipeRepository.findAll();
        return ResponseEntity.ok(l);
    }
    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file){
        return ResponseEntity.ok(s3Service.saveFile(file));
    }
    @GetMapping("/download/{filename}")
    public ResponseEntity<byte[]> download(@PathVariable("filename") String filename){
        HttpHeaders headers=new HttpHeaders();
        headers.add("Content-type", MediaType.ALL_VALUE);
        headers.add("Content-Disposition", "attachment; filename="+filename);
        byte[] bytes = s3Service.downloadFile(filename);
        return  ResponseEntity.status(HTTP_OK).body(bytes);
    }


    @DeleteMapping("{filename}")
    public  String deleteFile(@PathVariable("filename") String filename){
        return s3Service.deleteFile(filename);
    }

    @GetMapping("list")
    public List<String> getAllFiles(){

        return s3Service.listAllFiles();

    }
}
