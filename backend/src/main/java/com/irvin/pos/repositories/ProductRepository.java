package com.irvin.pos.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.irvin.pos.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    public Product getByCode(String code);
    public Product getByBarCode(String barCode);
    public List<Product> findByNameContainingIgnoreCase(String name);

    /**
     * Atomically takes stock, so concurrent sales can't oversell.
     * @return 1 when there was enough stock, 0 otherwise
     */
    @Modifying(flushAutomatically = true)
    @Query("update Product p set p.available = p.available - :quantity, p.version = p.version + 1 "
            + "where p.id = :id and p.available >= :quantity")
    int decreaseAvailable(@Param("id") long id, @Param("quantity") long quantity);

    @Modifying(flushAutomatically = true)
    @Query("update Product p set p.available = p.available + :quantity, p.version = p.version + 1 where p.id = :id")
    int increaseAvailable(@Param("id") long id, @Param("quantity") long quantity);
}
