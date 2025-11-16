package com.api.kanban.DTO;

import lombok.Data;

import java.util.List;

// gets the list of boards of the user to display in the navigation
@Data
public class NavInfo {
    private List<GetBoardDTO> boardsList;
}
