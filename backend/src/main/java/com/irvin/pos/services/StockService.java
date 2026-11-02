package com.irvin.pos.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.irvin.pos.dtos.AddStockDTO;
import com.irvin.pos.entities.Product;
import com.irvin.pos.entities.Stock;
import com.irvin.pos.entities.Supplier;
import com.irvin.pos.exceptions.EntityNotFoundException;
import com.irvin.pos.repositories.ProductRepository;
import com.irvin.pos.repositories.StockRepository;
import com.irvin.pos.repositories.SupplierRepository;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    public Stock createNewStok(Stock stock){
        return stockRepository.save(stock);
    }

    public Page<Stock> getAllStocks(){
        return stockRepository.findAll(PageRequest.of(0, 10));
    }

    @Transactional
    public Product addStock(AddStockDTO addStockDTO) {
        if (addStockDTO.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero.");
        }

        Product product = productRepository.findById(addStockDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product with id " + addStockDTO.getProductId()));

        Supplier supplier = supplierRepository.findById(addStockDTO.getSupplierId())
                .orElseThrow(() -> new EntityNotFoundException("Supplier with id " + addStockDTO.getSupplierId()));

        Stock stock = new Stock();
        stock.setSupplier(supplier);
        stock.setTotal(addStockDTO.getQuantity());
        Stock savedStock = stockRepository.save(stock);

        product.setStock(savedStock);
        product.setAvailable(product.getAvailable() + addStockDTO.getQuantity());
        return productRepository.save(product);
    }

}
