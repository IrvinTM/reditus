package com.irvin.pos.entities;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    @OneToMany(mappedBy = "customer")
    private List<Sale> sales;
    private String name, identification, address, phoneNumber, email;

    public Customer(String name, String identification, String address,	String phoneNumber, String email, List<Sale> sales){
        this.name = name;
        this.identification = identification;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.sales = sales;
    }
    public Customer(){
    }
    public List<Sale> getSales() {
        return sales;
    }
    public void setSales(List<Sale> sales) {
        this.sales = sales;
    }
    public long getId() {
        return id;
    }
    public String getName() {
		return name;
	}
    public void setName(String name) {
		this.name = name;
	}
	public String getIdentification() {
		return identification;
	}
	public void setIdentification(String identification) {
		this.identification = identification;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
}
