package com.irvin.pos.repositories; import org.springframework.data.jpa.repository.JpaRepository;
import com.irvin.pos.entities.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    public Customer findByIdentification(String identification);

    public Customer findByPhoneNumber(String phoneNumber);

    public Customer findByEmail(String email);
}
