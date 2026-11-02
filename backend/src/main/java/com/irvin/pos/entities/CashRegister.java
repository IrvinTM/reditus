package com.irvin.pos.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class CashRegister {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private long id;

	private String name;

	// cash currently in the drawer, in cents
	private long balance;

	@OneToMany(mappedBy = "cashRegister")
	private List<Transaction> transactions;

	@OneToMany(mappedBy = "cashRegister")
	private List<Sale> sales;

	public CashRegister() {
	}

	public CashRegister(String name) {
		this.name = name;
	}

	public long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getBalance() {
		return balance;
	}

	public void setBalance(long balance) {
		this.balance = balance;
	}

	public List<Transaction> getTransactions() {
		return transactions;
	}

	public List<Sale> getSales() {
		return sales;
	}
}
