package com.api.kanban.GlobalExceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> error = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(er ->
            error.put(er.getField(), er.getDefaultMessage())
        );
        return error;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleBadInputs(IllegalArgumentException e) {
        Map<String, String> err = new HashMap<>();
        err.put("ILLEGAL INPUT", e.getMessage());
        return err;
    }

    @ExceptionHandler(IllegalAccessError.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleDuplicateUser(IllegalAccessError e) {
        Map<String, String> err = new HashMap<>();
        err.put("ERROR", e.getMessage());
        return err;
    }
}
