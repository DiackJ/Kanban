package com.api.kanban.Service;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.BoardsDTO;
import com.api.kanban.DTO.EditBoardRequest;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.ColumnsRepository;
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
    @Autowired
    private ColumnsRepository columnsRepository;

    // create a new kanban board
    public Boards createNewBoard(BoardsDTO dto, Users user) {
        // check if a board with input title already exists
        Boards existingBoard = boardsRepository.findByBoardTitle(dto.getBoardTitle()).orElse(null);

        if (existingBoard != null) {
            throw new ResourceConflictException("A board with this title already exists.");
        }
         // create new board obj
        Boards board = new Boards();

        // set board details
        board.setBoardTitle(dto.getBoardTitle());
        board.setCreatedAt(LocalDateTime.now());
        board.setUpdatedAt(LocalDateTime.now());
        board.setUser(user);

        // only set description if provided by user
        if (dto.getDescription() != null) {
            board.setDescription(dto.getDescription());
        }
        boardsRepository.save(board);

        // create and set default columns
        Columns c1 = new Columns("To Do", board);
        Columns c2 = new Columns("In Progress", board);
        columnsRepository.save(c1);
        columnsRepository.save(c2);
        List<Columns> list = new ArrayList<>();
        list.add(c1);
        list.add(c2);
        board.setColumnsList(list);

        return boardsRepository.save(board);
    }

    // edit an existing board
    public Boards editBoard(EditBoardRequest dto, long id) {
        Boards board = boardsRepository.findById(id).orElseThrow(() -> new NoSuchElementException("board not found"));

        if (dto.getBoardTitle() != null) {
            board.setBoardTitle(dto.getBoardTitle());
        }

        if (dto.getDescription() != null) {
            board.setDescription(dto.getDescription());
        }
        board.setUpdatedAt(LocalDateTime.now());

        return boardsRepository.save(board);
    }

    // delete existing board
    public void deleteBoard(long id) {
        boardsRepository.deleteById(id);
    }
}
