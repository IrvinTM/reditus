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
	private long balance;
	@OneToMany(mappedBy = "cashRegister")
	private List<Transaction> transactions;
	@OneToMany(mappedBy = "cashRegister")
	private List<Sale> sales;


	public CashRegister(int balance, List<Transaction> transactions, List<Sale> sales) {
		this.balance = balance;
		this.transactions = transactions;
		this.sales = sales;
	}

	public CashRegister(){

	}
	public CashRegister(CashRegister cashRegister){
		this.balance = cashRegister.getBalance();
		this.transactions = cashRegister.getTransactions();
	}

	public long getBalance() {
		return balance;
	}

	public void setBalance(int balance) {
		this.balance = balance;
	}

	public List<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(List<Transaction> transactions) {
		this.transactions = transactions;
	}

	public long getId() {
		return id;
	}

	public List<Sale> getSales() {
		return sales;
	}

	public void setSales(List<Sale> sales) {
		this.sales = sales;
	}

}
