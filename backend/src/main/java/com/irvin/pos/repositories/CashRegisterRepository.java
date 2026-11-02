package com.irvin.pos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.irvin.pos.entities.CashRegister;

public interface CashRegisterRepository extends JpaRepository<CashRegister, Long> {

    // balance changes are done in the database so concurrent movements can't overwrite each other

    @Modifying(flushAutomatically = true)
    @Query("update CashRegister c set c.balance = c.balance + :delta where c.id = :id")
    int addToBalance(@Param("id") long id, @Param("delta") long delta);

    @Modifying(flushAutomatically = true)
    @Query("update CashRegister c set c.balance = :balance where c.id = :id")
    int setBalance(@Param("id") long id, @Param("balance") long balance);
}
