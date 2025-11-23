package com.api.kanban.Controller;

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
    // not adding description
    @PostMapping("/api/v1/column/{columnId}/task")
    public ResponseEntity<TasksDetailsDTO> createNewTask(@RequestBody TasksDTO dto, @PathVariable long columnId) {
        if (dto.getTaskTitle().isEmpty()) {
            throw new IllegalArgumentException("field cannot be blank");
        }
        TasksDetailsDTO task = tasksService.createNewTask(dto, columnId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(task);
    }

    // request to edit a task
    // able to edit title but not description
    @PutMapping("/api/v1/task/{id}")
    public ResponseEntity<TasksDetailsDTO> editTask(@RequestBody TasksDTO dto, @PathVariable long id) {
        TasksDetailsDTO task = tasksService.editTask(dto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(task);
    }
// good
    @PatchMapping("/api/v1/task/{id}/position")
    public ResponseEntity<TasksDetailsDTO> moveTask(@RequestBody MoveTaskRequest dto, @PathVariable long id) {
        TasksDetailsDTO task = tasksService.moveTask(dto, id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(task);
    }
// no columnId
    @GetMapping("/api/v1/task/{id}")
    public ResponseEntity<TasksDetailsDTO> getTask(@PathVariable long id) {
        TasksDetailsDTO task = tasksService.getTasks(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(task);
    }
// good
    @DeleteMapping("/api/v1/task/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable long id) {
        tasksService.deleteTask(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

}
