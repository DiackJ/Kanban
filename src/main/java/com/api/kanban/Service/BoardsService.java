package com.api.kanban.Service;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.*;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.ColumnsRepository;
import com.api.kanban.Repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@Service
public class BoardsService {
    private final UsersRepository usersRepository;
    private final BoardsRepository boardsRepository;
    private final ColumnsRepository columnsRepository;

    //@Autowired
    public BoardsService(BoardsRepository boardsRepository, ColumnsRepository columnsRepository, UsersRepository usersRepository) {
        this.columnsRepository = columnsRepository;
        this.boardsRepository = boardsRepository;
        this.usersRepository = usersRepository;
    }

    // create a new kanban board with title only
    public GetBoardDetailsDTO createNewBoard(BoardsDTO dto, UUID userId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("an error occurred. please try again"));
        // check if a board with input title already exists
        Boards existingBoard = boardsRepository.findByBoardTitleIgnoreCase(dto.getBoardTitle(), user.getId()).orElse(null);

        if (existingBoard != null) {
            throw new ResourceConflictException("A board with this title already exists.");
        }
         // create new board obj
        Boards board = new Boards();

        // set board details
        board.setBoardTitle(dto.getBoardTitle());
        if (dto.getDescription() != null) {
            board.setDescription(dto.getDescription());
        }
        board.setCreatedAt(LocalDateTime.now());
        board.setUpdatedAt(LocalDateTime.now());
        board.setUser(user);

        boardsRepository.save(board);

        // create and set default columns
        Columns c1 = new Columns("To Do", board);
        Columns c2 = new Columns("In Progress", board);
        columnsRepository.save(c1);
        columnsRepository.save(c2);

        System.out.println(board.getColumnsList());
        List<ColumnsDTO> colList;
        if (dto.getColumns() != null) {
            colList = dto.getColumns().stream()
                    .map(ColumnsDTO::new).toList();

            for (ColumnsDTO col : colList) {
                Columns c = new Columns(col.getStatusTitle(), board);
                columnsRepository.save(c);
            }
        }

        List<ColumnsDetailsDTO> cols = board.getColumnsList().stream().map(col -> new ColumnsDetailsDTO(
                col.getId(),
                col.getStatusTitle()
        )).toList();

        return new GetBoardDetailsDTO(
                board.getId(),
                board.getBoardTitle(),
                board.getDescription(),
                board.getUser().getId(),
                cols
        );
    }

    // edit an existing board
    public GetBoardDetailsDTO editBoard(EditBoardRequest dto, long id) {
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

        boardsRepository.save(board);

        return new GetBoardDetailsDTO(
                board.getId(),
                board.getBoardTitle(),
                board.getDescription()
        );
    }

    // delete existing board
    public void deleteBoard(long id) {
        boardsRepository.deleteById(id);
    }

    // reset board (delete all columns and tasks)
    public void resetBoard(long id) {
        List<Columns> cols = columnsRepository.findAllColumnsByBoardId(id);
        for (Columns c : cols) {
            columnsRepository.delete(c);
        }
    }
}
