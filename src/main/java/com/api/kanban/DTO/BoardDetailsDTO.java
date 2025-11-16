package com.api.kanban.DTO;

import com.api.kanban.Entity.Columns;
import com.api.kanban.Entity.Tasks;
import lombok.Data;

import java.util.List;

// get the current board's details
@Data
public class BoardDetailsDTO {
    private String boardTitle;
    private List<GetColumnsDTO> columns;
}
