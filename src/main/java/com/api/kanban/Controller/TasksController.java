package com.api.kanban.Controller;

import com.api.kanban.DTO.EditTaskRequest;
import com.api.kanban.DTO.MoveTaskRequest;
import com.api.kanban.DTO.TasksDTO;
import com.api.kanban.DTO.TasksDetailsDTO;
import com.api.kanban.Service.TasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class TasksController {
    @Autowired
    private TasksService tasksService;

    // request to create a new task
    @PostMapping("/api/v1/column/{colId}/task")
    public ResponseEntity<TasksDetailsDTO> createNewTask(@RequestBody TasksDTO dto, @PathVariable Long colId) {
        if (dto.getTaskTitle().isEmpty() || dto.getTaskTitle().equalsIgnoreCase("New Task")) {
            throw new IllegalArgumentException("task title is required.");
        }
        if (colId == null) {
            throw new IllegalArgumentException("status column is required.");
        }
        TasksDetailsDTO task = tasksService.createNewTask(dto, colId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(task);
    }

    // request to edit a task
    @PutMapping("/api/v1/task/{id}")
    public ResponseEntity<TasksDetailsDTO> editTask(@RequestBody EditTaskRequest dto, @PathVariable long id) {
        if (dto.getTaskTitle().isEmpty()) {
            throw new IllegalArgumentException("task title is required.");
        }

        TasksDetailsDTO task = tasksService.editTask(dto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(task);
    }

    @PatchMapping("/api/v1/task/{id}/position")
    public ResponseEntity<TasksDetailsDTO> moveTask(@RequestBody MoveTaskRequest dto, @PathVariable long id) {
        TasksDetailsDTO task = tasksService.moveTask(dto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(task);
    }

    @GetMapping("/api/v1/task/{id}")
    public ResponseEntity<TasksDetailsDTO> getTask(@PathVariable long id) {
        TasksDetailsDTO task = tasksService.getTasks(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(task);
    }

    @DeleteMapping("/api/v1/task/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable long id) {
        tasksService.deleteTask(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

}
