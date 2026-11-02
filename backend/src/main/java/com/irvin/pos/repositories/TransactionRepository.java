package com.irvin.pos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.irvin.pos.entities.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	
}
