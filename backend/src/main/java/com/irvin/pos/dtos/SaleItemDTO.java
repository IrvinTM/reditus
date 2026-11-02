package com.irvin.pos.dtos;

public class SaleItemDTO{

    private long id, productId, priceAtSale, saleId;
    private int quantity;

    public SaleItemDTO(){}

    public SaleItemDTO(long id, long productId, int quantity, long priceAtSale ) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.priceAtSale = priceAtSale;
    }

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public long getProductId() {
        return productId;
    }
    public void setProductId(long productId) {
        this.productId = productId;
    }
    public long getPriceAtSale() {
        return priceAtSale;
    }
    public void setPriceAtSale(long priceAtSale) {
        this.priceAtSale = priceAtSale;
    }
    public long getSaleId() {
        return saleId;
    }
    public void setSaleId(long saleId) {
        this.saleId = saleId;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}