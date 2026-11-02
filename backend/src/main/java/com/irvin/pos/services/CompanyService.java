package com.irvin.pos.services;

import com.irvin.pos.entities.Company;
import com.irvin.pos.repositories.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public Company saveOrUpdateCompany(Company company) {
        Optional<Company> existingCompany = companyRepository.findById(1L);
        if (existingCompany.isPresent()) {
            Company existing = existingCompany.get();
            existing.setName(company.getName());
            existing.setAddress(company.getAddress());
            existing.setPhoneNumber(company.getPhoneNumber());
            existing.setEmail(company.getEmail());
            existing.setLogo(company.getLogo());
            return companyRepository.save(existing);
        } else {
            Company newCompany = new Company(company.getName(), company.getAddress(), company.getPhoneNumber(),


                    company.getEmail(), company.getLogo());
            return companyRepository.save(newCompany);
        }
    }

    public Company getCompany(long id) {
        Optional<Company> company = companyRepository.findById(1L);
        if (company.isPresent()) {
            return company.get();
        } else {
            return null;
        }
    }

}
