package com.irvin.pos.dtos;

import java.util.List;

import com.irvin.pos.entities.Product;

public class TaxDTO {
    private long id;
    private String name;
    private String code;
    private int percentage;

    public TaxDTO(){
    }
    public TaxDTO(String name, String code, int percentage, List<Product> products){
	this.name = name;
	this.code = code;
	this.percentage = percentage;
    }
	public long getId() {
		return id;
	}
	public void setId(long id){
	    this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public int getPercentage() {
		return percentage;
	}
	public void setPercentage(int percentage) {
		this.percentage = percentage;
	}
}
