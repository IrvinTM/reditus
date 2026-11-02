package com.irvin.pos.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class SaleItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private long id;
	@ManyToOne
	@JoinColumn(name = "product_id")
	private Product product;
	private int quantity;
	private long priceAtSale;
	@ManyToOne
	@JoinColumn(name = "sale_id")
	private Sale sale;

	public long getId() {
		return id;
	}
	public Product getProduct() {
		return product;
	}
	public void setProduct(Product product) {
		this.product = product;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public long getPriceAtSale() {
		return priceAtSale;
	}
	public void setPriceAtSale(long priceAtSale) {
		this.priceAtSale = priceAtSale;
	}
	public Sale getSale() {
		return sale;
	}
	public void setSale(Sale sale) {
		this.sale = sale;
	}

}
