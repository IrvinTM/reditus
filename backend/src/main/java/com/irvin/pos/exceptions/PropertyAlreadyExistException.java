package com.irvin.pos.exceptions;

public class PropertyAlreadyExistException extends Exception {
    private final String property;
    private final String propertyValue;

    public PropertyAlreadyExistException(String property, String propertyValue) {
        super(property + " with value " + propertyValue + " already exists.");
        if (property == null || property.trim().isEmpty()) {
            throw new IllegalArgumentException("Property name cannot be null or empty.");
        }
        if (propertyValue == null || propertyValue.trim().isEmpty()) {
            throw new IllegalArgumentException("Property value cannot be null or empty.");
        }
        this.property = property;
        this.propertyValue = propertyValue;
    }

    public String getProperty() {
        return property;
    }

    public String getPropertyValue() {
        return propertyValue;
    }

    @Override
    public String toString() {
        return "PropertyAlreadyExistException{" +
                "property='" + property + '\'' +
                ", propertyValue='" + propertyValue + '\'' +
                '}';
    }
}