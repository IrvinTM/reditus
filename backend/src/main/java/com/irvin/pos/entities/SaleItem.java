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

	// snapshot of the product name so receipts don't change if the product is renamed
	private String productName;

	private int quantity;

	// unit price as charged, with the same tax treatment as the product (see priceIncludesTaxes)
	private long priceAtSale;

	private boolean priceIncludesTaxes;

	private boolean priceOverridden;

	// taxes for the whole line
	private long taxAmount;

	// line total including taxes
	private long lineTotal;

	// unit cost at the time of the sale, for profit reports
	private long unitCost;

	private int refundedQuantity;

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

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
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

	public boolean isPriceIncludesTaxes() {
		return priceIncludesTaxes;
	}

	public void setPriceIncludesTaxes(boolean priceIncludesTaxes) {
		this.priceIncludesTaxes = priceIncludesTaxes;
	}

	public boolean isPriceOverridden() {
		return priceOverridden;
	}

	public void setPriceOverridden(boolean priceOverridden) {
		this.priceOverridden = priceOverridden;
	}

	public long getTaxAmount() {
		return taxAmount;
	}

	public void setTaxAmount(long taxAmount) {
		this.taxAmount = taxAmount;
	}

	public long getLineTotal() {
		return lineTotal;
	}

	public void setLineTotal(long lineTotal) {
		this.lineTotal = lineTotal;
	}

	public long getUnitCost() {
		return unitCost;
	}

	public void setUnitCost(long unitCost) {
		this.unitCost = unitCost;
	}

	public int getRefundedQuantity() {
		return refundedQuantity;
	}

	public void setRefundedQuantity(int refundedQuantity) {
		this.refundedQuantity = refundedQuantity;
	}

	public Sale getSale() {
		return sale;
	}

	public void setSale(Sale sale) {
		this.sale = sale;
	}
}
