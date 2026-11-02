package com.irvin.pos.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Company {
    @Id
    private long id;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
    private String logo;

    // asigno el id ya que solo habra una compania
    public Company(String name, String address, String phoneNumber, String email, String logo) {
        this.id = 1;
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.logo = logo;
    }

    public Company() {
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getLogo() {
        return logo;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

}
