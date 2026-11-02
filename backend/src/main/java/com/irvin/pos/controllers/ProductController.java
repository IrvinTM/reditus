package com.irvin.pos.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.dtos.ProductDTO;
import com.irvin.pos.exceptions.PropertyAlreadyExistException;
import com.irvin.pos.services.ProductService;
@CrossOrigin 
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/")
    public CustomPageDTO<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping("/create")
    public ResponseEntity<ProductDTO> addProduct(@RequestBody ProductDTO product) throws PropertyAlreadyExistException {
        ProductDTO p = productService.createProduct(product);
        return ResponseEntity.ok(p);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable long id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update")
    public ResponseEntity<ProductDTO> updateProduct(@RequestBody ProductDTO product) {
        ProductDTO p = productService.updateProduct(product);
        return ResponseEntity.ok(p);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductByID(@PathVariable long id){
        ProductDTO prod = productService.getProductByID(id);
        return ResponseEntity.ok(prod);
    }

    @GetMapping("/barcode/{barCode}")
    public ResponseEntity<ProductDTO> getProductByBarCode(@PathVariable String barCode){
        ProductDTO prod = productService.getProductByBarCode(barCode);
        return ResponseEntity.ok(prod);
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<List<ProductDTO>> searchProductByName(@PathVariable String name){
        List<ProductDTO> products = productService.searchByName(name);
        return ResponseEntity.ok(products);
    }
}
