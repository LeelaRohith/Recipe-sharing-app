package com.example.backend.controllers;

import com.example.backend.database.*;
import com.example.backend.service.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final IngredientRepository ingredientRepository;
    Logger logger
            = LoggerFactory.getLogger(RecipeController.class);
    @Autowired
    private S3Service s3Service;;




    @PostMapping("/addrecipe/{userid}")
    public ResponseEntity<Response> addRecipe(@RequestBody Recipe recipe, @PathVariable Integer userid)
    {
        Optional<User> user = userRepository.findById(userid);
        recipe.setUser(user.get());

        Recipe savedRecipe = recipeRepository.save(recipe);

        return ResponseEntity.ok(Response.builder().text(savedRecipe.getId().toString()).build());
    }
    @PutMapping("/editrecipe/{userid}")
    public ResponseEntity<Response> editRecipe(@RequestBody RecipeDTO recipe,@PathVariable Integer userid)
    {
        Optional<User> user = userRepository.findById(userid);

        Optional<List<Ingredients>> l = ingredientRepository.findByRecipeId(recipe.getId());
        Recipe editedRecipe = Recipe
                .builder()
                .id(recipe.getId())
                .name(recipe.getName())
                .date(recipe.getDate())
                .description(recipe.getDescription())
                .ingredients(l.get())
                .user(user.get())
                .image(recipe.getImage())
                .cookingInstructions(recipe.getCookingInstructions())
                .build();
        recipeRepository.save(editedRecipe);
        return ResponseEntity.ok(Response.builder().text("Recipe Updated").build());
    }
    @Transactional
    @PostMapping("/delete/{userid}")
    public ResponseEntity<Response> deleteRecipe(@RequestBody Recipe recipe,@PathVariable Integer userid)
    {


        ingredientRepository.deleteByRecipeId(recipe.getId());
        recipeRepository.deleteById(recipe.getId());
        return ResponseEntity.ok(Response.builder().text("Recipe Deleted").build());

    }
    @PostMapping("/addingredients/{recipeid}")
    public ResponseEntity<Response> addIngredients(@RequestBody IngredientRequest ingredients,@PathVariable Integer recipeid)
    {
        Optional<Recipe> recipe = recipeRepository.findById(recipeid);
//        for(int i=0;i<ingredients.size();i++)
//        {
//            ingredients.get(i).setRecipe(recipe.get());
//            ingredientRepository.save(ingredients);
//
//        }
        for(int i=0;i<ingredients.ingredients.size();i++)
        {
           Ingredients in =  Ingredients.builder().ingredient(ingredients.ingredients.get(i)).recipe(recipe.get()).build();
           ingredientRepository.save(in);
        }

        return ResponseEntity.ok(Response.builder().text("Ingredients Added Successfully").build());
    }


    @GetMapping("/currentuserrecipes/{id}")
    public ResponseEntity<List<RecipeDTO>> getCurrentUserRecipes(@PathVariable Integer id)
    {
        Optional<List<Recipe>> l = recipeRepository.findByUserId(id);
         List<RecipeDTO> currentUserRecipes = new ArrayList<>();
       for(int i=0;i<l.get().size();i++)
       {
           Optional<List<Ingredients>> ingredients=ingredientRepository.findByRecipeId(l.get().get(i).getId());
           l.get().get(i).setIngredients(ingredients.get());
           List<IngredientsDTO> ingredientsDTO = new ArrayList<>();
           for(int j=0;j<ingredients.get().size();j++)
           {
               ingredientsDTO.add(IngredientsDTO
                       .builder()
                       .ingredient(ingredients.get().get(j).getIngredient())
                       .build());
           }
           RecipeDTO r = RecipeDTO
                   .builder()
                   .id(l.get().get(i).getId())
                   .name(l.get().get(i).getName())
                   .date(l.get().get(i).getDate())
                   .description(l.get().get(i).getDescription())
                   .cookingInstructions(l.get().get(i).getCookingInstructions())
                   .ingredients(ingredientsDTO)
                   .image(l.get().get(i).getImage())
                   .build();
           currentUserRecipes.add(r);
//           logger.info(String.valueOf(l.get().get(i).getId()));
//           logger.info(String.valueOf(l.get().get(i).getName()));
//           logger.info(String.valueOf(l.get().get(i).getDescription()));
//           logger.info(String.valueOf(l.get().get(i).getCookingInstructions()));
//           logger.info(String.valueOf(l.get().get(i).getIngredients().size()));
       }
        return ResponseEntity.ok(currentUserRecipes);
    }
    @GetMapping("/allrecipes")
    public ResponseEntity<List<RecipeDTO>> getallRecipes()
    {
        List<Recipe> l =recipeRepository.findAll();
        List<RecipeDTO> allRecipes = new ArrayList<>();
        for(int i=0;i<l.size();i++)
        {
            Optional<List<Ingredients>> ingredients=ingredientRepository.findByRecipeId(l.get(i).getId());
            l.get(i).setIngredients(ingredients.get());
            List<IngredientsDTO> ingredientsDTO = new ArrayList<>();
            for(int j=0;j<ingredients.get().size();j++)
            {
                ingredientsDTO.add(IngredientsDTO
                        .builder()
                        .ingredient(ingredients.get().get(j).getIngredient())
                        .build());
            }
            RecipeDTO r = RecipeDTO
                    .builder()
                    .id(l.get(i).getId())
                    .name(l.get(i).getName())
                    .date(l.get(i).getDate())
                    .description(l.get(i).getDescription())
                    .cookingInstructions(l.get(i).getCookingInstructions())
                    .ingredients(ingredientsDTO)
                    .image(l.get(i).getImage())
                    .build();
            allRecipes.add(r);
//            logger.info(String.valueOf(l.get(i).getId()));
//            logger.info(String.valueOf(l.get(i).getName()));
//            logger.info(String.valueOf(l.get(i).getDescription()));
//            logger.info(String.valueOf(l.get(i).getCookingInstructions()));
//            logger.info(String.valueOf(l.get(i).getIngredients().size()));
        }
        return ResponseEntity.ok(allRecipes);

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
