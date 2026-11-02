package com.irvin.pos.dtos;

public record UserDTO(
    long id,
    String username,
    String role,
    String name,
    String email,
    boolean enabled
) {
}
