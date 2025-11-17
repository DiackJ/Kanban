package com.api.kanban.DTO;

import lombok.Data;

@Data
public class VerifyRequest {
    private Integer code;
    private String email;
}
