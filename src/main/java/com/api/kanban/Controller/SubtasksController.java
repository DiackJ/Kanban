package com.api.kanban.Controller;

import com.api.kanban.DTO.IsCompleteDTO;
import com.api.kanban.DTO.SubtasksDTO;
import com.api.kanban.DTO.SubtasksDetailsDTO;
import com.api.kanban.Service.SubtasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class SubtasksController {
    @Autowired
    private SubtasksService subtasksService;
// good
    @PostMapping("/api/v1/task/{taskId}/subtask")
    public ResponseEntity<SubtasksDetailsDTO> addNewSubtask(@RequestBody SubtasksDTO dto, @PathVariable long taskId) {
        if(dto.getSubtaskTitle().isEmpty()) {
            throw new IllegalArgumentException("field cannot be blank");
        }
        SubtasksDetailsDTO subtask = subtasksService.addNewSubtask(dto, taskId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(subtask);
    }
// good
    @PutMapping("/api/v1/subtask/{id}")
    public ResponseEntity<SubtasksDetailsDTO> editSubtask(@RequestBody SubtasksDTO dto, @PathVariable long id) {
        SubtasksDetailsDTO subtask = subtasksService.editSubtask(dto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(subtask);
    }
// not changing to true
    @PutMapping("/api/v1/subtask/{id}/complete")
    public ResponseEntity<?> markAsComplete(@RequestBody IsCompleteDTO complete, @PathVariable long id) {
        subtasksService.markAsComplete(complete, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }
// good
    @DeleteMapping("/api/v1/subtask/{id}")
    public ResponseEntity<?> deleteSubtask(@PathVariable long id) {
        subtasksService.removeSubtask(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }
}
