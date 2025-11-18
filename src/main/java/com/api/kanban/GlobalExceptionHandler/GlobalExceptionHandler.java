package com.api.kanban.GlobalExceptionHandler;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.CustomException.UserNotVerifiedException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // handle user not found errors
    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleResourceNotFound(UsernameNotFoundException e) {
        Map<String, String> err = new HashMap<>();
        err.put("USER NOT FOUND", e.getMessage());
        return err;
    }

    // handle bad arguments / bad user input
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleBadInputs(IllegalArgumentException e) {
        Map<String, String> err = new HashMap<>();
        err.put("ILLEGAL INPUT", e.getMessage());
        return err;
    }

    // handle errors when a fetched resource (ex: board) is not found
    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleDuplicateUser(NoSuchElementException e) {
        Map<String, String> err = new HashMap<>();
        err.put("ERROR FINDING RESOURCE", e.getMessage());
        return err;
    }

    // handle errors for an unverified user
    @ExceptionHandler(UserNotVerifiedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, String> handleUserNotVerified(UserNotVerifiedException e) {
        Map<String, String> err = new HashMap<>();
        err.put("ERROR ACCESSING ACCOUNT", e.getMessage());
        return err;
    }

    // handle errors when a resource already exists
    @ExceptionHandler(ResourceConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleConflictingResources(ResourceConflictException e) {
        Map<String, String> err = new HashMap<>();
        err.put("RESOURCE CONFLICT ERROR", e.getMessage());
        return err;
    }

    //    // handle hibernate validation errors
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    @ResponseStatus(HttpStatus.BAD_REQUEST)
//    public Map<String, String> handleValidation(MethodArgumentNotValidException e) {
//        Map<String, String> error = new HashMap<>();
//        e.getBindingResult().getFieldErrors().forEach(er ->
//            error.put(er.getField(), er.getDefaultMessage())
//        );
//        return error;
//    }
}
