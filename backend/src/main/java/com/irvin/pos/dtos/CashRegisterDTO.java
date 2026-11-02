package com.irvin.pos.dtos;

public class CashRegisterDTO {
    private long id;
    private long balance;
    private int transactionCount;
    private int saleCount;

    public CashRegisterDTO(long id, long balance, int transactionCount, int saleCount) {
        this.id = id;
        this.balance = balance;
        this.transactionCount = transactionCount;
        this.saleCount = saleCount;
    }

    public CashRegisterDTO() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getBalance() {
        return balance;
    }

    public void setBalance(long balance) {
        this.balance = balance;
    }

    public int getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(int transactionCount) {
        this.transactionCount = transactionCount;
    }

    public int getSaleCount() {
        return saleCount;
    }

    public void setSaleCount(int saleCount) {
        this.saleCount = saleCount;
    }

}
