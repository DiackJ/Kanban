package com.api.kanban.DTO;

import lombok.Data;

import java.util.List;

@Data
public class TasksDTO {
    private String taskTitle;
    private String description;
    private List<String> subtasks;
    private long orderNum;
}
