package com.irvin.pos.dtos;

public record LoginResponseDTO(
    String token,
    String name,
    String email,
    String role
) {
}
