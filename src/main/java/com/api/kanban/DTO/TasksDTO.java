package com.api.kanban.DTO;

import com.api.kanban.Entity.Subtasks;
import lombok.Data;

import java.util.List;

@Data
public class TasksDTO {
    private String taskTitle;
    private List<Subtasks> subtasks;
    private long order;
}
