package com.irvin.pos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.irvin.pos.entities.Tax;

public interface TaxRepository extends JpaRepository<Tax, Long> {
    public Tax getByName(String name);
    public Tax getByCode(String code);

}
