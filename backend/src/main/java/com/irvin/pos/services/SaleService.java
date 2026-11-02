package com.irvin.pos.services;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.dtos.SaleDTO;
import com.irvin.pos.dtos.SaleItemDTO;
import com.irvin.pos.entities.CashRegister;
import com.irvin.pos.entities.Customer;
import com.irvin.pos.entities.Product;
import com.irvin.pos.entities.Sale;
import com.irvin.pos.entities.SaleItem;
import com.irvin.pos.exceptions.EntityNotFoundException;
import com.irvin.pos.repositories.CashRegisterRepository;
import com.irvin.pos.repositories.CustomerRepository;
import com.irvin.pos.repositories.ProductRepository;
import com.irvin.pos.repositories.SaleItemRepository;
import com.irvin.pos.repositories.SaleRepository;
import com.irvin.pos.utils.CustomPage;
import com.irvin.pos.utils.ObjectMapper;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CashRegisterRepository cashRegisterRepository;

    @Autowired
    private SaleItemRepository saleItemRepository;

    @Autowired
    private ProductRepository productRepository;

    // TODO fix exc not being catched by the handler
    // TODO
    @Transactional
    public SaleDTO addSale(SaleDTO saleDTO) {
        // Find customer if provided, anonymous sales can have null customer
        Customer customer = null;
        if (saleDTO.getCustomerID() != null) {
            customer = customerRepository.findById(saleDTO.getCustomerID())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Customer with ID " + saleDTO.getCustomerID() + " not found."));
        }
        CashRegister cashRegister = cashRegisterRepository.findById(saleDTO.getCashRegisterID())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cash Register with ID " + saleDTO.getCashRegisterID() + " not found."));

        // Create and save the Sale entity first
        Sale sale = new Sale();
        sale.setCustomer(customer);
        sale.setCashRegister(cashRegister);
        sale.setDiscount(saleDTO.getDiscount());
        sale.setTotal(saleDTO.getTotal());
        Sale savedSale = saleRepository.save(sale);

        // Create and save SaleItem entities
        List<SaleItem> items = new ArrayList<>();
        for (SaleItemDTO itemDTO : saleDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Product with ID " + itemDTO.getProductId() + " not found."));

            if (product.getAvailable() < itemDTO.getQuantity()) {
                throw new IllegalStateException("Product with ID " + itemDTO.getProductId() + " does not have enough stock.");
            }

            product.setAvailable(product.getAvailable() - itemDTO.getQuantity());
            productRepository.save(product);

            SaleItem saleItem = new SaleItem();
            saleItem.setSale(savedSale); // Associate with the saved Sale
            saleItem.setProduct(product);

            saleItem.setQuantity(itemDTO.getQuantity());
            saleItem.setPriceAtSale(itemDTO.getPriceAtSale());
            items.add(saleItemRepository.save(saleItem)); // Save the SaleItem
        }

        savedSale.setItems(items);
        return ObjectMapper.saleToDTO(saleRepository.save(savedSale));
    }

    public void deleteSale(long id) {
        saleRepository.deleteById(id);
    }

    public SaleDTO getSaleById(long saleId) {
        Optional<Sale> sale = saleRepository.findById(saleId);
        if (sale.isEmpty()) {
            throw new EntityNotFoundException("Sale");

        }
        return ObjectMapper.saleToDTO(sale.get());
    }

    public CustomPageDTO<SaleDTO> getAllSales() {
        Page<Sale> sales = saleRepository.findAll(PageRequest.of(0, 100));
        CustomPageDTO<SaleDTO> salesDTO = new CustomPageDTO<>();
        salesDTO.setCustomPage(
                new CustomPage(sales.getTotalElements(), sales.getTotalPages(),
                        sales.getNumber(), sales.getSize()));

        sales.forEach((sale) -> {
            salesDTO.addContent(ObjectMapper.saleToDTO(sale));
        });
        return salesDTO;
    }
}
