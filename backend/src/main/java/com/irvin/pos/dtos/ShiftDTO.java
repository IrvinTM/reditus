package com.irvin.pos.dtos;

import java.time.Instant;

import com.irvin.pos.entities.ShiftStatus;

/**
 * @param expectedCash cash that should be in the drawer now (or at close, for closed shifts)
 * @param difference   counted - expected, only for closed shifts
 */
public record ShiftDTO(
    long id,
    long cashRegisterId,
    String cashRegisterName,
    ShiftStatus status,
    String openedBy,
    Instant openedAt,
    long openingFloat,
    String closedBy,
    Instant closedAt,
    long expectedCash,
    Long countedCash,
    Long difference,
    String notes
) {
}
