package com.irvin.pos.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.irvin.pos.dtos.AddStockDTO;
import com.irvin.pos.dtos.ProductDTO;
import com.irvin.pos.entities.Product;
import com.irvin.pos.services.StockService;
import com.irvin.pos.utils.ObjectMapper;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockService stockService;

    @PostMapping("/add")
    public ResponseEntity<ProductDTO> addStock(@RequestBody AddStockDTO addStockDTO) {
        Product updatedProduct = stockService.addStock(addStockDTO);
        return ResponseEntity.ok(ObjectMapper.productToDTO(updatedProduct));
    }
}
