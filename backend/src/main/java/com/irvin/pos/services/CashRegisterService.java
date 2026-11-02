package com.irvin.pos.services;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.irvin.pos.dtos.CashRegisterDTO;
import com.irvin.pos.entities.CashRegister;
import com.irvin.pos.entities.ShiftStatus;
import com.irvin.pos.exceptions.EntityNotFoundException;
import com.irvin.pos.repositories.CashRegisterRepository;
import com.irvin.pos.repositories.ShiftRepository;

/**
 * CashRegisterService
 */
@Service
public class CashRegisterService {

    private final CashRegisterRepository cashRegisterRepository;
    private final ShiftRepository shiftRepository;

    public CashRegisterService(CashRegisterRepository cashRegisterRepository, ShiftRepository shiftRepository) {
        this.cashRegisterRepository = cashRegisterRepository;
        this.shiftRepository = shiftRepository;
    }

    /** The balance starts at zero, it's set when a shift is opened with a counted float. */
    @Transactional
    public CashRegisterDTO createCashRegister(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Debe indicar el nombre de la caja.");
        }
        return toDTO(cashRegisterRepository.save(new CashRegister(name.trim())));
    }

    @Transactional(readOnly = true)
    public CashRegisterDTO getCashRegisterById(long id) {
        CashRegister cashRegister = cashRegisterRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cash register with id " + id));
        return toDTO(cashRegister);
    }

    @Transactional(readOnly = true)
    public List<CashRegisterDTO> getAllCashRegisters() {
        return cashRegisterRepository.findAll(Sort.by("id")).stream().map(this::toDTO).toList();
    }

    private CashRegisterDTO toDTO(CashRegister cashRegister) {
        Long openShiftId = shiftRepository.findFirstByCashRegisterIdAndStatus(cashRegister.getId(), ShiftStatus.OPEN)
                .map(shift -> shift.getId())
                .orElse(null);
        return new CashRegisterDTO(cashRegister.getId(), cashRegister.getName(), cashRegister.getBalance(),
                openShiftId);
    }
}
