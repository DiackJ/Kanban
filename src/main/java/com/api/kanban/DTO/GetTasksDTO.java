package com.api.kanban.DTO;

import lombok.Data;

//get tasks from each column when full individual task not needed
@Data
public class GetTasksDTO {
    private long id;
    private String taskTitle;
    private int numberOfCompleteSubtasks;
    private int numberOfIncompleteSubtasks;

    public GetTasksDTO(long id, String title, int complete, int incomplete) {
        this.id = id;
        this.taskTitle = title;
        this.numberOfCompleteSubtasks = complete;
    }
}
