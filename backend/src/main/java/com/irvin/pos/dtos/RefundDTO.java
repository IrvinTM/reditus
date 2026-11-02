package com.irvin.pos.dtos;

import java.time.Instant;
import java.util.List;

import com.irvin.pos.entities.PaymentMethod;

public record RefundDTO(
    long id,
    long saleId,
    Instant date,
    String user,
    String reason,
    PaymentMethod method,
    long amount,
    List<Item> items
) {
    public record Item(long saleItemId, String productName, int quantity, long amount) {
    }
}
