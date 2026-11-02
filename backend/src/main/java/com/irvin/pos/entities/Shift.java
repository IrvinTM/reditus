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

@Entity
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    @ManyToOne
    @JoinColumn(name = "cash_register_id", nullable = false)
    private CashRegister cashRegister;

    @Enumerated(EnumType.STRING)
    private ShiftStatus status;

    @ManyToOne
    @JoinColumn(name = "opened_by")
    private UserAccount openedBy;

    private Instant openedAt;

    private long openingFloat;

    @ManyToOne
    @JoinColumn(name = "closed_by")
    private UserAccount closedBy;

    private Instant closedAt;

    // cash the system expects in the drawer at close
    private Long expectedCash;

    // cash the cashier actually counted at close
    private Long countedCash;

    private String notes;

    public long getId() {
        return id;
    }

    public CashRegister getCashRegister() {
        return cashRegister;
    }

    public void setCashRegister(CashRegister cashRegister) {
        this.cashRegister = cashRegister;
    }

    public ShiftStatus getStatus() {
        return status;
    }

    public void setStatus(ShiftStatus status) {
        this.status = status;
    }

    public UserAccount getOpenedBy() {
        return openedBy;
    }

    public void setOpenedBy(UserAccount openedBy) {
        this.openedBy = openedBy;
    }

    public Instant getOpenedAt() {
        return openedAt;
    }

    public void setOpenedAt(Instant openedAt) {
        this.openedAt = openedAt;
    }

    public long getOpeningFloat() {
        return openingFloat;
    }

    public void setOpeningFloat(long openingFloat) {
        this.openingFloat = openingFloat;
    }

    public UserAccount getClosedBy() {
        return closedBy;
    }

    public void setClosedBy(UserAccount closedBy) {
        this.closedBy = closedBy;
    }

    public Instant getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(Instant closedAt) {
        this.closedAt = closedAt;
    }

    public Long getExpectedCash() {
        return expectedCash;
    }

    public void setExpectedCash(Long expectedCash) {
        this.expectedCash = expectedCash;
    }

    public Long getCountedCash() {
        return countedCash;
    }

    public void setCountedCash(Long countedCash) {
        this.countedCash = countedCash;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
