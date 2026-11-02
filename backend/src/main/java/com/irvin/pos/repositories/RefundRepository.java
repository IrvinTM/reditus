package com.irvin.pos.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.irvin.pos.entities.Refund;

public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findBySaleId(long saleId);

    List<Refund> findByShiftId(long shiftId);
}
