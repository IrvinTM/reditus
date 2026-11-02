package com.irvin.pos.entities;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    private String name;
    private String code;
    private String barCode;
    private String measurementUnit;
    @ManyToMany
    @JoinTable(name = "product_categories", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;
    private boolean isActive;
    private boolean isAgeRestricted;
    private String description;
    private String image;
    private long cost;
    @ManyToMany
    @JoinTable(name = "product_taxes", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "tax_id"))
    private List<Tax> taxes;
    private boolean priceIncludesTaxes;
    private boolean allowPriceChange;
    private long noTaxIncludedPrice;
    private long taxIncludedPrice;
    private long profitMargin;
    private long salesPrice;
    private long available;
    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;

    public Product() {
    }

    public Product(long id, String name, String code, String barCode, String measurementUnit, List<Category> categories,
            boolean isActive, boolean isAgeRestricted, String description, String image, long cost, List<Tax> taxes,
            boolean priceIncludesTaxes, boolean allowPriceChange, long noTaxIncludedPrice, long taxIncludedPrice,
            long profitMargin, long salesPrice, long available) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.barCode = barCode;
        this.measurementUnit = measurementUnit;
        this.categories = categories;
        this.isActive = isActive;
        this.isAgeRestricted = isAgeRestricted;
        this.description = description;
        this.image = image;
        this.cost = cost;
        this.taxes = taxes;
        this.priceIncludesTaxes = priceIncludesTaxes;
        this.allowPriceChange = allowPriceChange;
        this.noTaxIncludedPrice = noTaxIncludedPrice;
        this.taxIncludedPrice = taxIncludedPrice;
        this.profitMargin = profitMargin;
        this.salesPrice = salesPrice;
        this.available = 0;
    }

    public Product(Product product) {
        this.name = product.getName();
        this.code = product.getCode();
        this.barCode = product.getBarCode();
        this.measurementUnit = product.getMeasurementUnit();
        this.categories = product.getCategories();
        this.isActive = product.isActive();
        this.isAgeRestricted = product.isAgeRestricted();
        this.description = product.getDescription();
        this.image = product.getImage();
        this.cost = product.getCost();
        this.taxes = product.getTaxes();
        this.priceIncludesTaxes = product.priceIncludesTaxes();
        this.allowPriceChange = product.allowPriceChange();
        this.noTaxIncludedPrice = product.getNoTaxIncludedPrice();
        this.taxIncludedPrice = product.getTaxIncludedPrice();
        this.profitMargin = product.getProfitMargin();
        this.salesPrice = product.getSalesPrice();
        this.available = 0;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public String getBarCode() {
        return barCode;
    }

    public String getMeasurementUnit() {
        return measurementUnit;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public boolean isActive() {
        return isActive;
    }

    public boolean isAgeRestricted() {
        return isAgeRestricted;
    }

    public String getDescription() {
        return description;
    }

    public String getImage() {
        return image;
    }

    public long getCost() {
        return cost;
    }

    public List<Tax> getTaxes() {
        return taxes;
    }

    public boolean priceIncludesTaxes() {
        return priceIncludesTaxes;
    }

    public boolean allowPriceChange() {
        return allowPriceChange;
    }

    public long getNoTaxIncludedPrice() {
        return noTaxIncludedPrice;
    }

    public long getTaxIncludedPrice() {
        return taxIncludedPrice;
    }

    public long getProfitMargin() {
        return profitMargin;
    }

    public long getSalesPrice() {
        return salesPrice;
    }

    public long getAvailable() {
        return available;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setBarCode(String barCode) {
        this.barCode = barCode;
    }

    public void setMeasurementUnit(String measurementUnit) {
        this.measurementUnit = measurementUnit;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public void setAgeRestricted(boolean isAgeRestricted) {
        this.isAgeRestricted = isAgeRestricted;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setCost(long cost) {
        this.cost = cost;
    }

    public void setTaxes(List<Tax> taxes) {
        this.taxes = taxes;
    }

    public void setPriceIncludesTaxes(boolean priceIncludesTaxes) {
        this.priceIncludesTaxes = priceIncludesTaxes;
    }

    public void setAllowPriceChange(boolean allowPriceChange) {
        this.allowPriceChange = allowPriceChange;
    }

    public void setNoTaxIncludedPrice(long noTaxIncludedPrice) {
        this.noTaxIncludedPrice = noTaxIncludedPrice;
    }

    public void setTaxIncludedPrice(long taxIncludedPrice) {
        this.taxIncludedPrice = taxIncludedPrice;
    }

    public void setProfitMargin(long profitMargin) {
        this.profitMargin = profitMargin;
    }

    public void setSalesPrice(long salesPrice) {
        this.salesPrice = salesPrice;
    }

    public void setStock(long available) {
        this.available = available;
    }

	public boolean isPriceIncludesTaxes() {
		return priceIncludesTaxes;
	}

	public boolean isAllowPriceChange() {
		return allowPriceChange;
	}

	public void setAvailable(long available) {
		this.available = available;
	}

	public Stock getStock() {
		return stock;
	}

	public void setStock(Stock stock) {
		this.stock = stock;
	}
    
}
