package com.irvin.pos.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.irvin.pos.dtos.SaleItemDTO;
import com.irvin.pos.entities.SaleItem;
import com.irvin.pos.repositories.ProductRepository;
import com.irvin.pos.repositories.SaleItemRepository;
import com.irvin.pos.repositories.SaleRepository;
import com.irvin.pos.utils.ObjectMapper;

@Service
public class SaleItemService {
    
    @Autowired
    private SaleItemRepository saleItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SaleRepository saleRepository;

    public SaleItemDTO createSaleItem(SaleItemDTO saleItemDTO){
        SaleItem saleItem = new SaleItem();
        saleItem.setPriceAtSale(saleItemDTO.getPriceAtSale());
        saleItem.setProduct(productRepository.findById(saleItemDTO.getProductId()).get());
        saleItem.setQuantity(saleItemDTO.getQuantity());
        saleItem.setSale(saleRepository.getReferenceById(saleItemDTO.getSaleId()));
        return ObjectMapper.saleItemToDTO(saleItemRepository.save(saleItem));
    }

    public SaleItemDTO findById(long id){
        return ObjectMapper.saleItemToDTO(saleItemRepository.findById(id).get());
    }
}
