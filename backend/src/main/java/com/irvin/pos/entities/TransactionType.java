package com.irvin.pos.entities;

/**
 * Cash movements in a register's drawer.
 * DEPOSIT / WITHDRAWAL are manual cash in / cash out, SALE and REFUND are created automatically.
 */
public enum TransactionType {
    DEPOSIT,
    WITHDRAWAL,
    SALE,
    REFUND
}
