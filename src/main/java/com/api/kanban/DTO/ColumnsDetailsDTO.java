package com.api.kanban.DTO;

import lombok.Data;

import java.util.List;
// for when columns are shown
@Data
public class ColumnsDetailsDTO {
    private long id;
    private String statusTitle;
    private long boardId;
    private List<TasksDetailsDTO> tasksList;

    public ColumnsDetailsDTO() {}
    public ColumnsDetailsDTO(long id, String statusTitle, long boardId) {
        this.id = id;
        this.statusTitle = statusTitle;
        this.boardId = boardId;
    }
    public ColumnsDetailsDTO(long id, String statusTitle) {
        this.id = id;
        this.statusTitle = statusTitle;
    }
}
