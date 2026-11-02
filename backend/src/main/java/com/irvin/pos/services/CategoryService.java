package com.irvin.pos.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.irvin.pos.dtos.CategoryDTO;
import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.entities.Category;
import com.irvin.pos.entities.Product;
import com.irvin.pos.exceptions.PropertyAlreadyExistException;
import com.irvin.pos.repositories.CategoryRepository;
import com.irvin.pos.repositories.ProductRepository;
import com.irvin.pos.utils.CustomPage;
import com.irvin.pos.utils.ObjectMapper;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    private ProductRepository productRepository;

    public CategoryDTO addCategory(CategoryDTO categoryDTO) throws PropertyAlreadyExistException{
        if (categoryRepository.findByName(categoryDTO.getName())!= null) {
            throw new PropertyAlreadyExistException("name", categoryDTO.getName());
        }
        //double check
        List<Product> categories = productRepository.findAllById(categoryDTO.getProductIDs());
        Category cat = ObjectMapper.dtoToCategory(categoryDTO, categories);
        return ObjectMapper.categoryToDTO(categoryRepository.save(cat));
    }
    public CustomPageDTO<CategoryDTO> getAllCategories(){
        Page<Category> categories = categoryRepository.findAll(PageRequest.of(0, 10));
        CustomPageDTO<CategoryDTO> myPage = new CustomPageDTO<>();
        categories.forEach((cat) -> {
            CategoryDTO c = ObjectMapper.categoryToDTO(cat);
            myPage.addContent(c);
            myPage.setCustomPage(new CustomPage(categories.getTotalElements(),
                        categories.getTotalPages(), categories.getNumber(), categories.getSize()));
        });
        
        
        return myPage;
    }

    //TODO create a proper exception
    public CategoryDTO updateCategorie(CategoryDTO categoryDTO){
        Optional<Category> catFromDB = categoryRepository.findById(categoryDTO.getId());
        if(catFromDB.isPresent()){
            Category cat = catFromDB.get();
            cat.setName(categoryDTO.getName());
        return ObjectMapper.categoryToDTO(categoryRepository.save(cat));
        }
        throw new IllegalStateException("Category doesnt exist");
    }

    public void deleteCategory(long id){
        categoryRepository.deleteById(id);
    }

}
