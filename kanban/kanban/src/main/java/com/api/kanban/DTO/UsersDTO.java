package com.api.kanban.DTO;

import lombok.Data;

@Data
public class UsersDTO {
    private String displayName;
    private String passwordHash;
}
