package com.api.kanban.Controller;

import com.api.kanban.DTO.BoardsDTO;
import com.api.kanban.DTO.ConfirmDeleteDTO;
import com.api.kanban.DTO.EditBoardRequest;
import com.api.kanban.Entity.Users;
import com.api.kanban.Service.BoardsService;
import com.api.kanban.Service.UsersService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BoardsController {
    @Autowired
    private BoardsService boardsService;
    @Autowired
    private UsersService usersService;

    @PostMapping("/api/v1/board")
    public ResponseEntity<BoardsDTO> createNewBoard(@RequestBody BoardsDTO dto, HttpServletRequest req) {
        Users user = usersService.getUser(req);

        boardsService.createNewBoard(dto, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(dto);
    }

    @PostMapping("/api/v1/{id}/board")
    public ResponseEntity<?> editBoard(@RequestBody EditBoardRequest dto, @PathVariable long id) {
        boardsService.editBoard(dto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

    @PostMapping("/api/v1/board/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable long id) {
        boardsService.deleteBoard(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }
}
