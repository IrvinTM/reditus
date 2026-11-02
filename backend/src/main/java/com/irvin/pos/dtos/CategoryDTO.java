package com.irvin.pos.dtos;

import java.util.List;

public class CategoryDTO {

    private long id;
    private String name;
    private List<Long> productIDs;

    public CategoryDTO(){}
    public CategoryDTO(long id, String name){
	this.id = id;
	this.name = name;
    }
    public CategoryDTO(CategoryDTO categoryDTO){
	id = categoryDTO.getId();
	name = categoryDTO.getName();
    }

	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<Long> getProductIDs() {
		return productIDs;
	}
	public void setProductIDs(List<Long> productIDs) {
		this.productIDs = productIDs;
	}
}
