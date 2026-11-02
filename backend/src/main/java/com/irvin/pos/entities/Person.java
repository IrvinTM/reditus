package com.irvin.pos.entities;

public class Person {
    private long id;
    private String name;
    private String identification;
    private String address;
    private String phoneNumber;
    private String email;

    public Person() {
    }

    public Person( String name, String identification, String address, String phoneNumber,
            String email) {
        this.name = name;
        this.identification = identification;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
    public String getIdentification() {
        return identification;
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

    public void setName(String name) {
        this.name = name;
    }
    public void setIdentification(String identification) {
        this.identification = identification;
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

}
