package com.api.kanban.Controller;

import com.api.kanban.DTO.IsCompleteDTO;
import com.api.kanban.DTO.SubtasksDTO;
import com.api.kanban.DTO.SubtasksDetailsDTO;
import com.api.kanban.Service.SubtasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SubtasksController {
    @Autowired
    private SubtasksService subtasksService;

    @PostMapping("/api/v1/task/{taskId}/subtask")
    public ResponseEntity<SubtasksDetailsDTO> addNewSubtask(@RequestBody SubtasksDTO dto, @PathVariable long taskId) {
        if(dto.getSubtaskTitle().isEmpty()) {
            throw new IllegalArgumentException("subtask title is required in order to add a new subtask.");
        }
        SubtasksDetailsDTO subtask = subtasksService.addNewSubtask(dto, taskId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(subtask);
    }

    @PutMapping("/api/v1/subtask/{id}")
    public ResponseEntity<SubtasksDetailsDTO> editSubtask(@RequestBody SubtasksDTO dto, @PathVariable long id) {
        SubtasksDetailsDTO subtask = subtasksService.editSubtask(dto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(subtask);
    }

    @PutMapping("/api/v1/subtask/{id}/complete")
    public ResponseEntity<?> markAsComplete(@PathVariable long id) {
        subtasksService.markAsComplete(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

//    @GetMapping("/api/v1/task/{id}/subtasks")
//    public ResponseEntity<List<SubtasksDetailsDTO>> getSubtasks (@PathVariable long taskId) {
//        List<SubtasksDetailsDTO> dto = subtasksService.getSubtasks(taskId);
//
//        return ResponseEntity
//                .status(HttpStatus.OK)
//                .body(dto);
//    }

    @DeleteMapping("/api/v1/subtask/{id}")
    public ResponseEntity<?> deleteSubtask(@PathVariable long id) {
        subtasksService.removeSubtask(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }
}
