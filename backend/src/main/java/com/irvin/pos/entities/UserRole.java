package com.irvin.pos.entities;

public enum UserRole {
    ADMINISTRADOR,
    CAJERO;

    public static UserRole from(String value) {
        if (value == null || value.isBlank()) {
            return CAJERO;
        }

        String normalized = value.trim().toUpperCase();

        return switch (normalized) {
            case "ADMIN", "ADMINISTRADOR" -> ADMINISTRADOR;
            case "CAJERO", "CASHIER", "USER" -> CAJERO;
            default -> CAJERO;
        };
    }
}
