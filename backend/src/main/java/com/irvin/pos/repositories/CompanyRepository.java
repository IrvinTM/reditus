package com.irvin.pos.repositories;

import com.irvin.pos.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CompanyRepository extends JpaRepository<Company, Long> {
}
