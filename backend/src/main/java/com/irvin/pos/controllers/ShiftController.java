package com.irvin.pos.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.irvin.pos.dtos.ShiftDTO;
import com.irvin.pos.dtos.ShiftReportDTO;
import com.irvin.pos.dtos.ShiftRequestsDTO;
import com.irvin.pos.services.ShiftService;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    /** The open shift of a register, 204 when there is none. */
    @GetMapping("/current")
    public ResponseEntity<ShiftDTO> getCurrent(@RequestParam long cashRegisterId) {
        ShiftDTO shift = shiftService.getCurrent(cashRegisterId);
        return shift == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(shift);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<ShiftDTO> getRecent(@RequestParam(defaultValue = "50") int size) {
        return shiftService.getRecent(Math.min(Math.max(size, 1), 500));
    }

    @GetMapping("/{id}")
    public ShiftDTO getById(@PathVariable long id) {
        return shiftService.getById(id);
    }

    @PostMapping("/open")
    public ShiftDTO open(@RequestBody ShiftRequestsDTO.Open request) {
        return shiftService.open(request);
    }

    @PostMapping("/{id}/cash")
    public ShiftDTO addCashMovement(@PathVariable long id, @RequestBody ShiftRequestsDTO.CashMovement request) {
        return shiftService.addCashMovement(id, request);
    }

    @PostMapping("/{id}/close")
    public ShiftDTO close(@PathVariable long id, @RequestBody ShiftRequestsDTO.Close request) {
        return shiftService.close(id, request);
    }

    @GetMapping("/{id}/report")
    public ShiftReportDTO report(@PathVariable long id) {
        return shiftService.report(id);
    }
}
