package com.api.kanban.DTO;

import lombok.Data;

// gets the board's title and id for navigation
@Data
public class GetBoardDTO {
    private String boardTitle;
    private long id;

    public GetBoardDTO(String title, long id) {
        this.boardTitle = title;
        this.id = id;
    }
}
