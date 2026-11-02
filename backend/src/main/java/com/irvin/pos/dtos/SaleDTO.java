package com.irvin.pos.dtos;

import java.time.Instant;
import java.util.List;

import com.irvin.pos.entities.PaymentMethod;
import com.irvin.pos.entities.SaleStatus;

public record SaleDTO(
    long id,
    Instant date,
    SaleStatus status,
    List<SaleItemDTO> items,
    List<PaymentDTO> payments,
    long subtotal,
    long taxTotal,
    long discount,
    long total,
    long refundedTotal,
    long cashRegisterID,
    Long shiftId,
    Long customerID,
    String customerName,
    String cashierName,
    Instant voidedAt,
    String voidedBy,
    String voidReason
) {
    public record PaymentDTO(PaymentMethod method, long amount, long tendered, long change) {
    }
}
