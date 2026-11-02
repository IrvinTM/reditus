package com.irvin.pos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.irvin.pos.entities.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long>{

}
