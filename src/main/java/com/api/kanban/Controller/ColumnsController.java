package com.api.kanban.Controller;

import com.api.kanban.DTO.ColumnsDTO;
import com.api.kanban.DTO.ColumnsDetailsDTO;
import com.api.kanban.Repository.ColumnsRepository;
import com.api.kanban.Service.ColumnsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ColumnsController {
    @Autowired
    private ColumnsService columnsService;

    // request to add (create) a new column
    @PostMapping("/api/v1/board/{boardId}/column")
    public ResponseEntity<ColumnsDetailsDTO> addNewColumn(@RequestBody ColumnsDTO dto, @PathVariable long boardId) {
        ColumnsDetailsDTO col = columnsService.addNewColumn(dto, boardId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(col);
    }

    // request for editing a column
    @PutMapping("/api/v1/column/{id}")
    public ResponseEntity<ColumnsDetailsDTO> editColumn(@RequestBody ColumnsDTO dto, @PathVariable long id) {
        ColumnsDetailsDTO col = columnsService.editColumnName(dto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(col);
    }

    @GetMapping("/api/v1/column")
    public ResponseEntity<List<ColumnsDetailsDTO>> getColumnsList(@PathVariable long boardId) {
        List<ColumnsDetailsDTO> list = columnsService.getColumnsList(boardId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(list);
    }

    @DeleteMapping("/api/v1/column/{id}")
    public ResponseEntity<?> deleteColumn(@PathVariable long id) {
        columnsService.removeColumn(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }
}
