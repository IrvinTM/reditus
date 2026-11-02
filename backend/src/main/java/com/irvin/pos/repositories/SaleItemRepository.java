package com.irvin.pos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.irvin.pos.entities.SaleItem;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {
} 