package com.api.kanban.CustomException;

public class ResourceNotFound extends RuntimeException{
    public ResourceNotFound(String message) {
        super(message);
    }
}
