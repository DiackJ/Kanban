package com.api.kanban.DTO;

import lombok.Data;

@Data
public class SubtasksDetailsDTO {
    private long id;
    private String subtaskTitle;
    private boolean isComplete;
    private long taskId;

    public SubtasksDetailsDTO() {}
    public SubtasksDetailsDTO(long id, String title, boolean complete, long taskId) {
        this.id = id;
        this.subtaskTitle = title;
        this.isComplete = complete;
        this.taskId = taskId;
    }
}
