package com.irvin.pos.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.dtos.SupplierDTO;
import com.irvin.pos.entities.Supplier;
import com.irvin.pos.exceptions.EntityNotFoundException;
import com.irvin.pos.exceptions.PropertyAlreadyExistException;
import com.irvin.pos.repositories.SupplierRepository;
import com.irvin.pos.utils.CustomPage;
import com.irvin.pos.utils.ObjectMapper;

@Service
public class SupplierService {

    @Autowired
    SupplierRepository supplierRepository;
    
    public SupplierDTO createSupplier(SupplierDTO supplierDTO) throws PropertyAlreadyExistException {
        if (supplierRepository.getByIdentification(supplierDTO.getIdentification()) != null

        ) {
            throw new PropertyAlreadyExistException("identification", String.valueOf(supplierDTO.getIdentification()));
        } else if (supplierRepository.getByPhoneNumber(supplierDTO.getPhoneNumber()) != null) {
            throw new PropertyAlreadyExistException("phone_number", supplierDTO.getPhoneNumber());
        } else if (supplierRepository.getByEmail(supplierDTO.getEmail()) != null) {
            throw new PropertyAlreadyExistException("email", supplierDTO.getEmail());
        }
        Supplier supplier = ObjectMapper.dtoToSupplier(supplierDTO, new Supplier());
        return ObjectMapper.supplierToDTO(supplierRepository.save(supplier));
    }
    
    public SupplierDTO updateSupplier(SupplierDTO supplierDTO){
        Supplier supplier = supplierRepository.findById(supplierDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Supplier with id " + supplierDTO.getId()));
        Supplier updatedSupplier = ObjectMapper.dtoToSupplier(supplierDTO, supplier);
        return ObjectMapper.supplierToDTO(supplierRepository.save(updatedSupplier));
    }

    public void deleteSupplier(long id){
        supplierRepository.deleteById(id);
    }

    public CustomPageDTO<SupplierDTO> getAllSuppliers(){
        Page<Supplier> peoplePage = supplierRepository.findAll(PageRequest.of(0, 10));
        CustomPageDTO<SupplierDTO> page = new CustomPageDTO<>();
        page.setCustomPage(new CustomPage(peoplePage.getTotalElements(), peoplePage.getTotalPages(), peoplePage.getNumber(),
                peoplePage.getSize()));
        peoplePage.forEach(supplier -> page.addContent(ObjectMapper.supplierToDTO(supplier)));
        return page;
    }
}
