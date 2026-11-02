package com.irvin.pos.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.irvin.pos.dtos.CashRegisterDTO;
import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.services.CashRegisterService;

@RestController
@RequestMapping("/api/cashregister")
public class CashRegisterController {

    @Autowired
    private CashRegisterService cashRegisterService;

    @GetMapping
    public CustomPageDTO<CashRegisterDTO> getAllCashRegisters() {
        return cashRegisterService.getAllCashRegister();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CashRegisterDTO> getCashRegisterById(@PathVariable long id) {
        return ResponseEntity.ok(cashRegisterService.getCashRegisterById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<CashRegisterDTO> createCashRegister(@RequestBody CashRegisterDTO cashRegisterDTO) {
        return ResponseEntity.ok(cashRegisterService.createCashRegister(cashRegisterDTO));
    }
}
