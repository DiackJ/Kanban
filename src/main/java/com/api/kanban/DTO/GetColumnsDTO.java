package com.api.kanban.DTO;

import lombok.Data;

import java.util.List;

// get the columns of a board
@Data
public class GetColumnsDTO {
    private long id;
    private String statusTitle;
    private List<GetTasksDTO> tasks;

    public GetColumnsDTO(long id, String status) {
        this.id = id;
        this.statusTitle = status;
    }
}
