package com.irvin.pos.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.dtos.RefundDTO;
import com.irvin.pos.dtos.RefundRequestDTO;
import com.irvin.pos.dtos.SaleDTO;
import com.irvin.pos.dtos.SaleRequestDTO;
import com.irvin.pos.dtos.VoidSaleRequestDTO;
import com.irvin.pos.services.SaleService;

/**
 * Sales can't be edited or deleted, only voided or refunded by an administrator.
 */
@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping("/create")
    public ResponseEntity<SaleDTO> addSale(@RequestBody SaleRequestDTO request) {
        return ResponseEntity.ok(saleService.addSale(request));
    }

    @GetMapping
    public CustomPageDTO<SaleDTO> getAllSales() {
        return saleService.getAllSales();
    }

    @GetMapping("/sale/{saleId}")
    public ResponseEntity<SaleDTO> getSaleById(@PathVariable long saleId) {
        return ResponseEntity.ok(saleService.getSaleById(saleId));
    }

    @PostMapping("/{saleId}/void")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<SaleDTO> voidSale(@PathVariable long saleId, @RequestBody VoidSaleRequestDTO request) {
        return ResponseEntity.ok(saleService.voidSale(saleId, request));
    }

    @PostMapping("/{saleId}/refunds")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<RefundDTO> refund(@PathVariable long saleId, @RequestBody RefundRequestDTO request) {
        return ResponseEntity.ok(saleService.refund(saleId, request));
    }

    @GetMapping("/{saleId}/refunds")
    public List<RefundDTO> getRefunds(@PathVariable long saleId) {
        return saleService.getRefunds(saleId);
    }
}
