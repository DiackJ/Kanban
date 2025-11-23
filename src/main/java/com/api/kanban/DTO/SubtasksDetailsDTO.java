package com.api.kanban.DTO;

import lombok.Data;

@Data
public class SubtasksDetailsDTO {
    private long id;
    private String subtaskTitle;
    private boolean isComplete;
    private long taskId;

    public SubtasksDetailsDTO() {}
    public SubtasksDetailsDTO(long id, String subtaskTitle, boolean isComplete, long taskId) {
        this.id = id;
        this.subtaskTitle = subtaskTitle;
        this.isComplete = isComplete;
        this.taskId = taskId;
    }
}
