package com.api.kanban.DTO;

import lombok.Data;

@Data
public class UsersDTO {
    private String email;
    private String passwordHash;
}
