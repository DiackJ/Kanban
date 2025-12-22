package com.api.kanban.DTO;

import com.api.kanban.Entity.Tasks;
import lombok.Data;


@Data
public class SubtasksDTO {
    private String subtaskTitle;
    private Tasks task;
}
