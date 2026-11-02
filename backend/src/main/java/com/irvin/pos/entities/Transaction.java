package com.irvin.pos.entities;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    private long amount;
    private Instant date;
    private TransactionType transactionType;
    @ManyToOne
    @JoinColumn(name = "cash_register_id")
    private CashRegister cashRegister;

    public Transaction(){

    }
    public Transaction(long amount,  TransactionType transactionType, CashRegister cashRegister){
	this.amount = amount;
	this.date = Instant.now();
	this.transactionType = transactionType;
	this.cashRegister = cashRegister;
    }

	public long getId() {
		return id;
	}
	public long getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
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
}
