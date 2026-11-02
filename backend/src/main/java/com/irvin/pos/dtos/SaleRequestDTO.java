package com.irvin.pos.dtos;

import java.util.List;

import com.irvin.pos.entities.PaymentMethod;

/**
 * What the register sends to complete a sale. Prices, taxes and totals are computed by the server.
 *
 * @param discount discount over the sale total, in cents
 */
public record SaleRequestDTO(
    List<Item> items,
    long discount,
    long cashRegisterID,
    Long customerID,
    List<PaymentDTO> payments
) {
    /**
     * @param price only used for products that allow price changes, null to use the product price
     */
    public record Item(long productId, int quantity, Long price) {
    }

    /**
     * @param amount for cash, the amount the customer handed over (change is computed)
     */
    public record PaymentDTO(PaymentMethod method, long amount) {
    }
}
