package com.api.kanban.DTO;

import lombok.Data;

@Data
public class UserDetailsDTO {
    private String email;
    private boolean enabled;

    public UserDetailsDTO(String email, boolean enabled) {
        this.email = email;
        this.enabled = enabled;
    }
}
