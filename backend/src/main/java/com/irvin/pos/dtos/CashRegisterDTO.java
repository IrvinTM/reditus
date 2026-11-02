package com.irvin.pos.dtos;

/**
 * @param openShiftId null when the register has no open shift
 */
public record CashRegisterDTO(long id, String name, long balance, Long openShiftId) {
}
