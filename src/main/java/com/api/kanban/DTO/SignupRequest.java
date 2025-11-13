package com.api.kanban.DTO;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String passwordHash;
}
