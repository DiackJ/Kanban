package com.api.kanban.DTO;

import lombok.Data;

import java.util.List;

@Data
public class BoardsDTO {
    private String boardTitle;
    private String description;
    private List<ColumnsDTO> columns;
}
