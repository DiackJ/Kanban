package com.api.kanban.DTO;

import com.api.kanban.Entity.Subtasks;
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
    private List<SubtasksDetailsDTO> subtasks;
    private long order;

    public TasksDetailsDTO(){}
    public TasksDetailsDTO(long id, String taskTitle, String status, long columnId) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.statusColumn = status;
        this.columnId = columnId;
    }
    public TasksDetailsDTO(long id, String taskTitle, String description, String status, int complete, int incomplete, List<SubtasksDetailsDTO> subtasks, long columnId, long order) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.description = description;
        this.statusColumn = status;
        this.numOfCompleteTasks = complete;
        this.numOfIncompleteTasks = incomplete;
        this.subtasks = subtasks;
        this.columnId = columnId;
        this.order = order;
    }
    public TasksDetailsDTO(long id, String taskTitle, String description) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.description = description;
    }
    public TasksDetailsDTO(long id, String taskTitle, int complete, int incomplete) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.numOfCompleteTasks = complete;
        this.numOfIncompleteTasks = incomplete;
    }
    public TasksDetailsDTO(long id, String taskTitle, long order) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.order = order;
    }


    public TasksDetailsDTO(long id, String taskTitle, long colId, String statusColumn, int complete, int incomplete, List<SubtasksDetailsDTO> subtasks, long order) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.columnId = colId;
        this.statusColumn = statusColumn;
        this.numOfCompleteTasks = complete;
        this.numOfIncompleteTasks = incomplete;
        this.subtasks = subtasks;
        this.order = order;
    }

}
