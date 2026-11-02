package com.irvin.pos.dtos;

import com.irvin.pos.entities.TransactionType;

public final class ShiftRequestsDTO {

    private ShiftRequestsDTO() {
    }

    public record Open(long cashRegisterId, long openingFloat) {
    }

    /** @param type DEPOSIT (cash in) or WITHDRAWAL (cash out) */
    public record CashMovement(TransactionType type, long amount, String reason) {
    }

    public record Close(long countedCash, String notes) {
    }
}
