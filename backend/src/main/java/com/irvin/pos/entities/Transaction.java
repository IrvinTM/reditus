package com.irvin.pos.entities;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * A movement of cash in or out of a register's drawer. Amount is always positive, the type gives the direction.
 */
@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    private long amount;

    private Instant date;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @ManyToOne
    @JoinColumn(name = "cash_register_id")
    private CashRegister cashRegister;

    @ManyToOne
    @JoinColumn(name = "shift_id")
    private Shift shift;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserAccount user;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    private Sale sale;

    private String reason;

    public Transaction() {
    }

    public Transaction(long amount, TransactionType transactionType, Shift shift, UserAccount user, String reason) {
        this.amount = amount;
        this.date = Instant.now();
        this.transactionType = transactionType;
        this.shift = shift;
        this.cashRegister = shift.getCashRegister();
        this.user = user;
        this.reason = reason;
    }

    public boolean isCashIn() {
        return transactionType == TransactionType.DEPOSIT || transactionType == TransactionType.SALE;
    }

    public long signedAmount() {
        return isCashIn() ? amount : -amount;
    }

    public long getId() {
        return id;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }

    public Instant getDate() {
        return date;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public CashRegister getCashRegister() {
        return cashRegister;
    }

    public void setCashRegister(CashRegister cashRegister) {
        this.cashRegister = cashRegister;
    }

    public Shift getShift() {
        return shift;
    }

    public UserAccount getUser() {
        return user;
    }

    public Sale getSale() {
        return sale;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }

    public String getReason() {
        return reason;
    }
}
