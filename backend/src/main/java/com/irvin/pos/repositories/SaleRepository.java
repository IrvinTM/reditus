package com.irvin.pos.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.irvin.pos.entities.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long>{
    List<Sale> findByShiftId(long shiftId);
}
