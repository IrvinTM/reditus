package com.irvin.pos.dtos;

/**
 * @param cashRegisterId register giving back the cash, its shift must be open
 */
public record VoidSaleRequestDTO(String reason, long cashRegisterId) {
}
