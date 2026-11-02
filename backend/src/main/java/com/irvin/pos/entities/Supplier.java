package com.irvin.pos.entities;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Supplier{

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    @OneToMany(mappedBy = "supplier")
    private List<Stock> stocks;
    private String name, identification, address, phoneNumber, email;

    public Supplier(String name, String identification, String address,	String phoneNumber, String email, List<Stock> stocks){
        this.name = name;
        this.identification = identification;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.stocks = stocks;
    }
    public Supplier(){
    }
    public List<Stock> getStocks() {
        return stocks;
    }
    public void setSales(List<Stock> stocks) {
        this.stocks = stocks;
    }
    public long getId() {
        return id;
    }
	public void setStocks(List<Stock> stocks) {
		this.stocks = stocks;
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
