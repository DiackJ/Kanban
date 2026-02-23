package com.api.kanban.Controller;

import com.api.kanban.DTO.BoardsDTO;
import com.api.kanban.DTO.EditBoardRequest;
import com.api.kanban.DTO.GetBoardDetailsDTO;
import com.api.kanban.Entity.Users;
import com.api.kanban.Service.BoardsService;
import com.api.kanban.Service.UsersService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class BoardsController {
    @Autowired
    private BoardsService boardsService;
    @Autowired
    private UsersService usersService;


    @PostMapping("/api/v1/board")
    public ResponseEntity<GetBoardDetailsDTO> createNewBoard(@RequestBody BoardsDTO dto, HttpServletRequest req) {
        if(dto.getBoardTitle() == null || dto.getBoardTitle().isEmpty() || dto.getBoardTitle().equalsIgnoreCase("New Board")) {
            throw new IllegalArgumentException("board title is required.");
        }

        Users user = usersService.getUser(req);

        GetBoardDetailsDTO res = boardsService.createNewBoard(dto, user.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(res);
    }

    @PutMapping("/api/v1/board/{id}")
    public ResponseEntity<GetBoardDetailsDTO> editBoard(@RequestBody EditBoardRequest dto, @PathVariable long id) {
        if (dto.getBoardTitle() == null || dto.getBoardTitle().isEmpty()) {
            throw new IllegalArgumentException("board title is required.");
        }

        GetBoardDetailsDTO res = boardsService.editBoard(dto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(res);
    }

    @PutMapping("/api/v1/board/{id}/delete")
    public ResponseEntity<?> deleteBoard(@PathVariable long id) {
        boardsService.deleteBoard(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

    @PutMapping("/api/v1/board/{id}/reset")
    public ResponseEntity<?> resetBoard(@PathVariable long id) {
        boardsService.resetBoard(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }
}
