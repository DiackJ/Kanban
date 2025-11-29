package com.api.kanban.DTO;

import lombok.Data;

@Data
public class EditTaskRequest {
    private String taskTitle;
    private String description;
}
