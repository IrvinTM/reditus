package com.irvin.pos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.irvin.pos.entities.Category;

/**
 * CategoryRepository
 */
public interface CategoryRepository extends JpaRepository<Category, Long>{
    public Category findByName(String name);
}
