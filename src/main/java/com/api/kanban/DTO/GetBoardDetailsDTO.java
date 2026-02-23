package com.api.kanban.DTO;

import com.api.kanban.Entity.Columns;
import lombok.Data;

import java.util.List;
import java.util.UUID;
// when a board is selected to view
@Data
public class GetBoardDetailsDTO {
    private long id;
    private String boardTitle;
    private String description;
    private UUID userId;
    private List<ColumnsDetailsDTO> columnsList;

    public GetBoardDetailsDTO() {}
    public GetBoardDetailsDTO(long id, String title, String desc, UUID userId, List<ColumnsDetailsDTO> colList) {
        this.id = id;
        this.boardTitle = title;
        this.description = desc;
        this.userId = userId;
        this.columnsList = colList;
    }
    public GetBoardDetailsDTO(long id, String title) {
        this.id = id;
        this.boardTitle = title;
    }
    public GetBoardDetailsDTO(long id, String title, String desc) {
        this.id = id;
        this.boardTitle = title;
        this.description = desc;
    }

}
