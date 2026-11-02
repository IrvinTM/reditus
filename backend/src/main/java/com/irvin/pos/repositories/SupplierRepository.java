package com.irvin.pos.repositories; import org.springframework.data.jpa.repository.JpaRepository;
import com.irvin.pos.entities.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    public Supplier getByIdentification(String identification);

    public Supplier getByPhoneNumber(String phoneNumber);

    public Supplier getByEmail(String email);
}
