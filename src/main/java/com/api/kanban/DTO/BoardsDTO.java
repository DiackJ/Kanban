package com.api.kanban.DTO;

import com.api.kanban.Entity.Columns;
import lombok.Data;

import java.util.List;

@Data
public class BoardsDTO {
    private String boardTitle;
    private String description;
}
