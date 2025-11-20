package com.api.kanban.DTO;

import lombok.Data;

@Data
public class EditBoardRequest {
    private String boardTitle;
    private String description;
}
