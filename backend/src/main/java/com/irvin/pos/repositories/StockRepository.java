package com.irvin.pos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.irvin.pos.entities.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {
}
