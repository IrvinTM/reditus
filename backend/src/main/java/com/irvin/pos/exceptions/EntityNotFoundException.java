package com.irvin.pos.exceptions;

/**
 * EntityNotFoundException
 */
public class EntityNotFoundException extends RuntimeException {
	private String entity;

	public EntityNotFoundException(String entity) {
		super(entity + " was not found or does not exist.");
	}

	public String getEntity() {
		return entity;
	}

	public void setEntity(String entity) {
		this.entity = entity;
	}
}
