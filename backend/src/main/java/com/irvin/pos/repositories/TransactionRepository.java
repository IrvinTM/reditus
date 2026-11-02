package com.irvin.pos.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.irvin.pos.entities.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByShiftIdOrderByDateAsc(long shiftId);
}
