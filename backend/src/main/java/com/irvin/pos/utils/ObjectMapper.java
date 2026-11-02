package com.irvin.pos.utils;

import java.util.ArrayList;
import java.util.List;


import com.irvin.pos.dtos.CategoryDTO;
import com.irvin.pos.dtos.ProductDTO;
import com.irvin.pos.dtos.SupplierDTO;
import com.irvin.pos.dtos.TaxDTO;
import com.irvin.pos.entities.Category;
import com.irvin.pos.entities.Product;
import com.irvin.pos.entities.Supplier;
import com.irvin.pos.entities.Tax;

public class ObjectMapper {

    


    public static Product dtoToProduct(ProductDTO productDTO, List<Category> categories, List<Tax> taxes) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setCode(productDTO.getCode());
        product.setBarCode(productDTO.getBarCode());
        product.setMeasurementUnit(productDTO.getMeasurementUnit());
        product.setCategories(categories);
        product.setActive(productDTO.isActive());
        product.setAgeRestricted(productDTO.isAgeRestricted());
        product.setDescription(productDTO.getDescription());
        product.setImage(productDTO.getImage());
        product.setCost(productDTO.getCost());
        product.setTaxes(taxes);
        product.setPriceIncludesTaxes(productDTO.isPriceIncludesTaxes());
        product.setAllowPriceChange(productDTO.isAllowPriceChange());
        product.setNoTaxIncludedPrice(productDTO.getNoTaxIncludedPrice());
        product.setTaxIncludedPrice(productDTO.getTaxIncludedPrice());
        product.setProfitMargin(productDTO.getProfitMargin());
        product.setSalesPrice(productDTO.getSalesPrice());
        product.setAvailable(productDTO.getAvailable());
        return product;
    }

    public static ProductDTO productToDTO(Product product) {
        List<Long> categories = new ArrayList<>();
        product.getCategories().forEach((category) -> categories.add(category.getId()));

        List<Long> taxes = new ArrayList<>();
        product.getTaxes().forEach(tax -> taxes.add(tax.getId()));

        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setName(product.getName());
        productDTO.setCode(product.getCode());
        productDTO.setBarCode(product.getBarCode());
        productDTO.setMeasurementUnit(product.getMeasurementUnit());
        productDTO.setCategories(categories);
        productDTO.setActive(product.isActive());
        productDTO.setAgeRestricted(product.isAgeRestricted());
        productDTO.setDescription(product.getDescription());
        productDTO.setImage(product.getImage());
        productDTO.setCost(product.getCost());
        productDTO.setTaxes(taxes);
        productDTO.setPriceIncludesTaxes(product.priceIncludesTaxes());
        productDTO.setAllowPriceChange(product.allowPriceChange());
        productDTO.setNoTaxIncludedPrice(product.getNoTaxIncludedPrice());
        productDTO.setTaxIncludedPrice(product.getTaxIncludedPrice());
        productDTO.setProfitMargin(product.getProfitMargin());
        productDTO.setSalesPrice(product.getSalesPrice());
        productDTO.setAvailable((int) product.getAvailable());
        return productDTO;
    }

    public static TaxDTO taxToDTO(Tax tax) {
        TaxDTO dto = new TaxDTO();
        dto.setId(tax.getId());
        dto.setName(tax.getName());
        dto.setCode(tax.getCode());
        dto.setPercentage(tax.getPercentage());
        return dto;
    }

    public static Tax dtoToTax(TaxDTO taxDTO, Tax tax) {
        tax.setName(taxDTO.getName());
        tax.setCode(taxDTO.getCode());
        tax.setPercentage(taxDTO.getPercentage());
        return tax;
    }

    public static CategoryDTO categoryToDTO(Category category) {
        return new CategoryDTO(category.getId(), category.getName());
    }

    public static Category dtoToCategory(CategoryDTO categoryDTO, List<Product> product) {
        return new Category(categoryDTO.getId(), categoryDTO.getName());
    }

    public static SupplierDTO supplierToDTO(Supplier supplier) {
        SupplierDTO dto = new SupplierDTO();
        dto.setId(supplier.getId());
        dto.setName(supplier.getName());
        dto.setIdentification(supplier.getIdentification());
        dto.setAddress(supplier.getAddress());
        dto.setPhoneNumber(supplier.getPhoneNumber());
        dto.setEmail(supplier.getEmail());
        return dto;
    }

    public static Supplier dtoToSupplier(SupplierDTO supplierDTO, Supplier supplier) {
        supplier.setName(supplierDTO.getName());
        supplier.setIdentification(supplierDTO.getIdentification());
        supplier.setAddress(supplierDTO.getAddress());
        supplier.setPhoneNumber(supplierDTO.getPhoneNumber());
        supplier.setEmail(supplierDTO.getEmail());
        return supplier;
    }


}
