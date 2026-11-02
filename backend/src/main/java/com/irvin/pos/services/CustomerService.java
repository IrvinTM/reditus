package com.irvin.pos.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.entities.Customer;
import com.irvin.pos.exceptions.EntityNotFoundException;
import com.irvin.pos.exceptions.PropertyAlreadyExistException;
import com.irvin.pos.repositories.CustomerRepository;
import com.irvin.pos.utils.CustomPage;


@Service
public class CustomerService {

    @Autowired
    CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) throws PropertyAlreadyExistException {
        if (customerRepository.findByIdentification(customer.getIdentification()) != null

        ) {
            throw new PropertyAlreadyExistException("identification", String.valueOf(customer.getIdentification()));
        } else if (customerRepository.findByPhoneNumber(customer.getPhoneNumber()) != null) {
            throw new PropertyAlreadyExistException("phone_number", customer.getPhoneNumber());
        } else if (customerRepository.findByEmail(customer.getEmail()) != null) {
            throw new PropertyAlreadyExistException("email", customer.getEmail());
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public void deleteCustomer(long id) {
        customerRepository.deleteById(id);
    }

    public CustomPageDTO<Customer> getAllCustomers() {
        Page<Customer> peoplePage = customerRepository.findAll(PageRequest.of(0, 10));
        CustomPageDTO<Customer> page = new CustomPageDTO<>();
        CustomPage p = new CustomPage(peoplePage.getTotalElements(), peoplePage.getTotalPages(), peoplePage.getNumber(),
                peoplePage.getSize());
        page.setCustomPage(p);
        page.setContent(peoplePage.getContent());
        return page;
    }

    public Customer getCustomerByIdentification(String identification) throws EntityNotFoundException {
        Customer cust = customerRepository.findByIdentification(identification);
        if (cust == null) {
            throw new EntityNotFoundException("Customer");
        }
        return cust;
    }

    public Customer getCustomerByEmail(String email) throws EntityNotFoundException {
        Customer cust = customerRepository.findByEmail(email);
        if(cust == null){
            throw new EntityNotFoundException("Customer");
        }
            return cust;
    }

    public Customer getCustomerByPhoneNumber(String phoneNumber) throws EntityNotFoundException {
        Customer cust =  customerRepository.findByPhoneNumber(phoneNumber);
        if (cust == null) {
            throw new EntityNotFoundException("Customer");
        }
        return cust;
    }
}
