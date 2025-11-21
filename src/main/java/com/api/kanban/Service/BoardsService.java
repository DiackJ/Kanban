package com.api.kanban.Service;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.BoardsDTO;
import com.api.kanban.DTO.EditBoardRequest;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.ColumnsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
public class BoardsService {
    private final BoardsRepository boardsRepository;
    private final ColumnsRepository columnsRepository;

    //@Autowired
    public BoardsService(BoardsRepository boardsRepository, ColumnsRepository columnsRepository) {
        this.columnsRepository = columnsRepository;
        this.boardsRepository = boardsRepository;
    }

    // create a new kanban board
    public Boards createNewBoard(BoardsDTO dto, Users user) {
        // check if a board with input title already exists
        Boards existingBoard = boardsRepository.findByBoardTitleIgnoreCase(dto.getBoardTitle()).orElse(null);

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

        return board;
    }

    // edit an existing board
    public Boards editBoard(EditBoardRequest dto, long id) {
        Boards board = boardsRepository.findById(id).orElseThrow(() -> new NoSuchElementException("board not found"));

        if (board.getBoardTitle().equalsIgnoreCase(dto.getBoardTitle())) {
            throw new ResourceConflictException("a board with this title already exists");
        }

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
