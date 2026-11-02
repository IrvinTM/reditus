package com.irvin.pos.dtos;

public record SaleItemDTO(
    long id,
    long productId,
    String productName,
    int quantity,
    long priceAtSale,
    boolean priceIncludesTaxes,
    long taxAmount,
    long lineTotal,
    int refundedQuantity
) {
}
