package com.api.kanban.Service;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.ColumnsDTO;
import com.api.kanban.DTO.ColumnsDetailsDTO;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.ColumnsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class ColumnsService {
    @Autowired
    private ColumnsRepository columnsRepository;
    @Autowired
    private BoardsRepository boardsRepository;

    // add a new column to a board
    public ColumnsDetailsDTO addNewColumn(ColumnsDTO dto, long boardId) {
        Boards board = boardsRepository.findById(boardId).orElseThrow(() -> new NoSuchElementException("board not found"));
        Columns existingColumn = columnsRepository.findByStatusTitleIgnoreCase(dto.getStatusTitle()).orElse(null);

        if (existingColumn != null) {
            throw new ResourceConflictException("a column with this title already exists");
        }

        Columns column = new Columns();
        column.setStatusTitle(dto.getStatusTitle());
        column.setBoard(board);

        columnsRepository.save(column);
        return new ColumnsDetailsDTO(
                column.getId(),
                column.getStatusTitle(),
                column.getBoard().getId()
        );
    }

    public ColumnsDetailsDTO editColumnName(ColumnsDTO dto, long id) {
        Columns col = columnsRepository.findById(id).orElseThrow(() -> new NoSuchElementException("column not found"));

        if (col.getStatusTitle().equalsIgnoreCase(dto.getStatusTitle())) {
            throw new ResourceConflictException("a column with this title already exists");
        }

        if (!dto.getStatusTitle().isEmpty() && dto.getStatusTitle() != null) {
            col.setStatusTitle(dto.getStatusTitle());
        }

        columnsRepository.save(col);
        return new ColumnsDetailsDTO(
                col.getId(),
                col.getStatusTitle()
        );
    }

    public void removeColumn(long id) {
        columnsRepository.deleteById(id);
    }
}
