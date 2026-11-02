package com.irvin.pos.entities;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class UserRoleConverter implements AttributeConverter<UserRole, String> {

    @Override
    public String convertToDatabaseColumn(UserRole attribute) {
        UserRole role = attribute != null ? attribute : UserRole.CAJERO;
        return role.name();
    }

    @Override
    public UserRole convertToEntityAttribute(String dbData) {
        return UserRole.from(dbData);
    }
}
