package com.irvin.pos.services;

import org.springframework.data.domain.Page;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.dtos.ProductDTO;
import com.irvin.pos.entities.Category;
import com.irvin.pos.entities.Product;
import com.irvin.pos.entities.Tax;
import com.irvin.pos.exceptions.PropertyAlreadyExistException;
import com.irvin.pos.repositories.CategoryRepository;
import com.irvin.pos.repositories.ProductRepository;
import com.irvin.pos.repositories.TaxRepository;
import com.irvin.pos.utils.CustomPage;
import com.irvin.pos.utils.ObjectMapper;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private TaxRepository taxRepository;

    public ProductDTO createProduct(ProductDTO productDTO) throws PropertyAlreadyExistException {
        if (productRepository.getByCode(productDTO.getCode()) != null) {
            throw new PropertyAlreadyExistException("code", String.valueOf(productDTO.getCode()));
        }
        if (productRepository.getByBarCode(productDTO.getBarCode()) != null) {
            throw new PropertyAlreadyExistException("bar code", productDTO.getBarCode());
        }
        List<Category> categories = new ArrayList<>();
        productDTO.getCategories().forEach(id -> {
            Optional<Category> cat = categoryRepository.findById(id);
            if (cat.isPresent()) {
                categories.add(cat.get());
            }
        });
        List<Tax> taxes = new ArrayList<>();
        productDTO.getTaxes().forEach(id -> {
            Optional<Tax> tax = taxRepository.findById(id);
            if (tax.isPresent()) {
                taxes.add(tax.get());
            }
        });
        Product newProduct = ObjectMapper.dtoToProduct(productDTO, categories, taxes);
        return ObjectMapper.productToDTO(productRepository.save(newProduct));
    }

    public ProductDTO updateProduct(ProductDTO productDTO) {
        List<Category> categories = new ArrayList<>();
            productDTO.getCategories().forEach(id -> {
                Optional<Category> cat = categoryRepository.findById(id);
                if (cat.isPresent()) {
                    categories.add(cat.get());
                }
            });
            List<Tax> taxes = new ArrayList<>();
            productDTO.getTaxes().forEach(id -> {
                Optional<Tax> tax = taxRepository.findById(id);
                if (tax.isPresent()) {
                    taxes.add(tax.get());
                }
            });
            /*Product newProduct = ObjectMapper.dtoToProduct(productDTO, categories, taxes);*/
            Optional<Product> pr = productRepository.findById(productDTO.getId());
            if(pr.isPresent()){
                //i may need a better way to do this
                Product prod = pr.get();
                prod.setName(productDTO.getName());
                prod.setCode(productDTO.getCode());
                prod.setBarCode(productDTO.getBarCode());
                prod.setMeasurementUnit(productDTO.getMeasurementUnit());
                prod.setCategories(categories);
                prod.setActive(productDTO.isActive());
                prod.setAgeRestricted(productDTO.isAgeRestricted());
                prod.setDescription(productDTO.getDescription());
                prod.setImage(productDTO.getImage());
                prod.setCost(productDTO.getCost());
                prod.setTaxes(taxes);
                prod.setPriceIncludesTaxes(productDTO.isPriceIncludesTaxes());
                prod.setAllowPriceChange(productDTO.isAllowPriceChange());
                prod.setNoTaxIncludedPrice(productDTO.getNoTaxIncludedPrice());
                prod.setTaxIncludedPrice(productDTO.getTaxIncludedPrice());
                prod.setProfitMargin(productDTO.getProfitMargin());
                prod.setSalesPrice(productDTO.getSalesPrice());
                prod.setAvailable(productDTO.getAvailable());
            return ObjectMapper.productToDTO(productRepository.save(prod));
            }else{
                throw new IllegalArgumentException("Product not found");
            }
    }

    public void deleteProduct(long id) throws IllegalArgumentException {
        productRepository.deleteById(id);
    }

    public CustomPageDTO<ProductDTO> getAllProducts() {
        CustomPageDTO<ProductDTO> page = new CustomPageDTO<>();
        Page<Product> pPage = productRepository.findAll(PageRequest.of(0, 10));
        pPage.getContent().forEach((product) ->{
            ProductDTO p = ObjectMapper.productToDTO(product);
            page.addContent(p);
        });
        CustomPage customPage =
            new CustomPage(pPage.getTotalElements(),
                        pPage.getTotalPages(),
                        pPage.getNumber(),
                        pPage.getSize());
        page.setCustomPage(customPage);
        return page;
    }

    public ProductDTO getProductByID(long id){
        ProductDTO product = ObjectMapper.productToDTO(productRepository.getReferenceById(id));
        return product;
    }

    public ProductDTO getProductByBarCode(String barCode){
        Product product = productRepository.getByBarCode(barCode);
        return ObjectMapper.productToDTO(product);
    }

    public List<ProductDTO> searchByName(String name ){
        List<Product> products = productRepository.findByNameContainingIgnoreCase(name);
        List<ProductDTO> productsDTO = new ArrayList<>();
        products.forEach(product -> {
            productsDTO.add(ObjectMapper.productToDTO(product));
        });
        return productsDTO;
    }

}
