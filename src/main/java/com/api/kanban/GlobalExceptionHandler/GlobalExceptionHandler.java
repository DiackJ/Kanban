package com.api.kanban.GlobalExceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // handle resource not found errors
    @ExceptionHandler(ResourceAccessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleResourceNotFound(ResourceAccessException e) {
        Map<String, String> err = new HashMap<>();
        err.put("NOT FOUND", e.getMessage());
        return err;
    }
}
