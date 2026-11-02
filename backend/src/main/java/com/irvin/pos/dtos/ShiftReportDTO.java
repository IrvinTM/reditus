package com.irvin.pos.dtos;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import com.irvin.pos.entities.PaymentMethod;
import com.irvin.pos.entities.TransactionType;

/**
 * End of shift (Z) report. Sales figures exclude voided sales.
 */
public record ShiftReportDTO(
    ShiftDTO shift,
    int salesCount,
    long subtotal,
    long taxTotal,
    long discountTotal,
    long salesTotal,
    Map<PaymentMethod, Long> salesByPaymentMethod,
    int voidedCount,
    long voidedTotal,
    int refundsCount,
    long refundsTotal,
    Map<PaymentMethod, Long> refundsByPaymentMethod,
    long cashSales,
    long cashRefunds,
    long cashDeposits,
    long cashWithdrawals,
    List<Movement> movements
) {
    public record Movement(long id, Instant date, TransactionType type, long amount, String user, String reason, Long saleId) {
    }
}
