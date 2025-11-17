package com.api.kanban.DTO;

import lombok.Data;

//get tasks from each column
@Data
public class GetTasksDTO {
    private long id;
    private String taskTitle;

    public GetTasksDTO(long id, String title) {
        this.id = id;
        this.taskTitle = title;
    }
}
