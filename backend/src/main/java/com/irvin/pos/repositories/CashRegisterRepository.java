package com.irvin.pos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.irvin.pos.entities.CashRegister;

public interface CashRegisterRepository extends JpaRepository<CashRegister, Long> {
}
