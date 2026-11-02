package com.irvin.pos.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.irvin.pos.dtos.CashRegisterDTO;
import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.entities.CashRegister;
import com.irvin.pos.exceptions.EntityNotFoundException;
import com.irvin.pos.repositories.CashRegisterRepository;
import com.irvin.pos.utils.CustomPage;
import com.irvin.pos.utils.ObjectMapper;

/**
 * CashRegisterService
 */
@Service
public class CashRegisterService {

    @Autowired
    private CashRegisterRepository cashRegisterRepository;

    public CashRegisterDTO createCashRegister(CashRegisterDTO cashRegisterDTO) {
        CashRegister cashRegister = new CashRegister();
        cashRegister.setBalance((int) cashRegisterDTO.getBalance());
        return ObjectMapper.cashRegisterToDTO(cashRegisterRepository.save(cashRegister));
    }

    public CashRegisterDTO getCashRegisterById(long id) {
        CashRegister cashRegister = cashRegisterRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cash register with id " + id));
        return ObjectMapper.cashRegisterToDTO(cashRegister);
    }

    public CustomPageDTO<CashRegisterDTO> getAllCashRegister() {
        CustomPageDTO<CashRegisterDTO> page = new CustomPageDTO<>();
        Page<CashRegister> p = cashRegisterRepository.findAll(PageRequest.of(0, 10));
        CustomPage customPage = new CustomPage(p.getTotalElements(), p.getTotalPages(), p.getNumber(), p.getSize());
        p.forEach(cashRegister -> page.addContent(ObjectMapper.cashRegisterToDTO(cashRegister)));
        page.setCustomPage(customPage);
        return page;
    }
}
