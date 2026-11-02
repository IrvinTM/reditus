package com.irvin.pos.dtos;

import java.util.List;

import com.irvin.pos.entities.PaymentMethod;

/**
 * @param cashRegisterId register giving back the money, its shift must be open
 */
public record RefundRequestDTO(List<Item> items, String reason, PaymentMethod method, long cashRegisterId) {
    public record Item(long saleItemId, int quantity) {
    }
}
