package com.irvin.pos.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.irvin.pos.dtos.CategoryDTO;
import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.exceptions.PropertyAlreadyExistException;
import com.irvin.pos.services.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/add")
    public ResponseEntity<CategoryDTO> addCategory(@RequestBody CategoryDTO category) throws PropertyAlreadyExistException{
        CategoryDTO c = categoryService.addCategory(category);
        return ResponseEntity.ok(c);
    }

    @GetMapping
    public CustomPageDTO<CategoryDTO> getAllCategories(){
        return categoryService.getAllCategories();
    }

    @PutMapping("/update")
    public ResponseEntity<CategoryDTO> updateCategory(@RequestBody CategoryDTO category){
        CategoryDTO c = categoryService.updateCategorie(category);
        return ResponseEntity.ok(c);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<CategoryDTO> deleteCategory(@PathVariable long id){
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
