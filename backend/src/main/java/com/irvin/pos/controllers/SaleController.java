package com.irvin.pos.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.dtos.SaleDTO;
import com.irvin.pos.entities.Sale;
import com.irvin.pos.exceptions.EntityNotFoundException;
import com.irvin.pos.services.SaleService;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @PostMapping("/create")
    public ResponseEntity<SaleDTO> addSale(@RequestBody SaleDTO saleDTO) {
        SaleDTO s = saleService.addSale(saleDTO);
        return ResponseEntity.ok(s);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<SaleDTO> deleteSale(@PathVariable long id) {
        saleService.deleteSale(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public CustomPageDTO<SaleDTO> getAllSales() {
        return saleService.getAllSales();
    }

    @GetMapping("/sale/{saleId}")
    public ResponseEntity<SaleDTO> getSaleById(@PathVariable long saleId) {
        return ResponseEntity.ok(saleService.getSaleById(saleId));
    }

    @PostMapping("/edit")
    public ResponseEntity<SaleDTO> editSale(@RequestBody SaleDTO sale) {
        SaleDTO s = saleService.addSale(sale);
        return ResponseEntity.ok(s);
    }

}
