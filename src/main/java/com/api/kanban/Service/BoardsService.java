package com.api.kanban.Service;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.BoardsDTO;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.UsersRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class BoardsService {
    @Autowired
    private BoardsRepository boardsRepository;

    // create a new kanban board
    public Boards createNewBoard(BoardsDTO dto, Users user) {
        // check if a board with input title already exists
        Boards existingBoard = boardsRepository.findByBoardTitle(dto.getBoardTitle()).orElse(null);

        if (existingBoard != null) {
            throw new ResourceConflictException("A board with this title already exists.");
        }
         // create new board obj
        Boards board = new Boards();
        // create adn set default columns
        Columns defaultColumn1 = new Columns();
        defaultColumn1.setStatusTitle("To Do");
        defaultColumn1.setBoard(board);
        Columns defaultColumn2 = new Columns();
        defaultColumn2.setStatusTitle("In Progress");
        defaultColumn2.setBoard(board);

        List<Columns> columnsList = new ArrayList<>();
        columnsList.add(defaultColumn1);
        columnsList.add(defaultColumn2);
        // set board details
        board.setBoardTitle(dto.getBoardTitle());
        board.setCreatedAt(LocalDateTime.now());
        board.setUser(user);
        board.setColumnsList(columnsList);
        // only set description if provided by user
        if (dto.getDescription() != null) {
            board.setDescription(dto.getDescription());
        }

        return boardsRepository.save(board);
    }

    // edit an existing board
//    public BoardsDTO editBoard(BoardsDTO dto, long id) {
//        Boards board = boardsRepository.findById(id).orElseThrow(() -> new NoSuchElementException("board not found"));
//
//
//    }
}
