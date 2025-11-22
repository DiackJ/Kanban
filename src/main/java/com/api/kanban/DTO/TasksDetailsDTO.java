package com.api.kanban.DTO;

import lombok.Data;

import java.util.List;
// for when a task is selected
@Data
public class TasksDetailsDTO {
    private long id;
    private String taskTitle;
    private String description;
    private String statusColumn;
    private long columnId;
    private int numOfCompleteTasks;
    private int numOfIncompleteTasks;
    private List<SubtasksDetailsDTO> subtasksList;

    public TasksDetailsDTO(){}
    public TasksDetailsDTO(long id, String taskTitle, String status, long columnId) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.statusColumn = status;
        this.columnId = columnId;
    }
    public TasksDetailsDTO(long id, String taskTitle, String status, int complete, int incomplete, List<SubtasksDetailsDTO> subtasksList) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.statusColumn = status;
        this.numOfCompleteTasks = complete;
        this.numOfIncompleteTasks = incomplete;
        this.subtasksList = subtasksList;
    }
    public TasksDetailsDTO(long id, String taskTitle) {
        this.id = id;
        this.taskTitle = taskTitle;
    }
    public TasksDetailsDTO(long id, String taskTitle, int complete, int incomplete) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.numOfCompleteTasks = complete;
        this.numOfIncompleteTasks = incomplete;
    }
}
