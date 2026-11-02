package com.irvin.pos.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.dtos.TaxDTO;
import com.irvin.pos.entities.Tax;
import com.irvin.pos.exceptions.PropertyAlreadyExistException;
import com.irvin.pos.repositories.TaxRepository;
import com.irvin.pos.utils.CustomPage;
import com.irvin.pos.utils.ObjectMapper;

@Service
public class TaxService {

    @Autowired
    private TaxRepository taxRepository;

    public TaxDTO createTax(TaxDTO taxDTO) throws PropertyAlreadyExistException{
        if (taxRepository.getByName(taxDTO.getName()) != null) {
            throw new PropertyAlreadyExistException("name", taxDTO.getName());
        }else if(taxRepository.getByCode(taxDTO.getCode()) != null){
            throw new PropertyAlreadyExistException("code", taxDTO.getCode());
        }
        Tax taxFromDb = new Tax();
        Tax newTax = ObjectMapper.dtoToTax(taxDTO, taxFromDb);
        return ObjectMapper.taxToDTO(taxRepository.save(newTax));
    }

    public CustomPageDTO<TaxDTO> getAllTaxes(){
        CustomPageDTO<TaxDTO> page =
            new CustomPageDTO<>();
        Page<Tax> p = taxRepository.findAll(PageRequest.of(0, 10));
            p.forEach(tax -> page.getContent().add(ObjectMapper.taxToDTO(tax)));
        CustomPage pageDetails = new CustomPage(p.getTotalElements(), p.getTotalPages(), p.getNumber(), p.getSize());
        page.setCustomPage(pageDetails);
        return page;

    }

    public TaxDTO getTaxByID(long id) throws Exception{
        //throws entity not found from jakarta-- never null
    Tax tax = taxRepository.getReferenceById(id);
        return ObjectMapper.taxToDTO(tax);
    }

    public TaxDTO updateTax(TaxDTO taxDTO)throws Exception{
        Optional<Tax> t = taxRepository.findById(taxDTO.getId());
        if (t.isPresent()) {
            Tax taxFromDb = t.get();
            Tax newTax = ObjectMapper.dtoToTax(taxDTO, taxFromDb);
            return ObjectMapper.taxToDTO(taxRepository.save(newTax));
        }else{
            throw new Exception("tax not found");
        }
    }
    public void deleteTax(long id){
        taxRepository.deleteById(id);
    }
}
