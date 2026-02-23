package com.api.kanban.DTO;

import lombok.Data;

// gets the board's title and id for navigation
@Data
public class GetBoardNavDTO {
    private long id;
    private String boardTitle;

    public GetBoardNavDTO(String title, long id) {
        this.boardTitle = title;
        this.id = id;
    }
}
