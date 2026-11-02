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

import com.irvin.pos.dtos.CashRegisterDTO;
import com.irvin.pos.services.CashRegisterService;

@RestController
@RequestMapping("/api/cashregister")
public class CashRegisterController {

    public record CreateCashRegisterRequest(String name) {
    }

    private final CashRegisterService cashRegisterService;

    public CashRegisterController(CashRegisterService cashRegisterService) {
        this.cashRegisterService = cashRegisterService;
    }

    @GetMapping
    public List<CashRegisterDTO> getAllCashRegisters() {
        return cashRegisterService.getAllCashRegisters();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CashRegisterDTO> getCashRegisterById(@PathVariable long id) {
        return ResponseEntity.ok(cashRegisterService.getCashRegisterById(id));
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<CashRegisterDTO> createCashRegister(@RequestBody CreateCashRegisterRequest request) {
        return ResponseEntity.ok(cashRegisterService.createCashRegister(request.name()));
    }
}
