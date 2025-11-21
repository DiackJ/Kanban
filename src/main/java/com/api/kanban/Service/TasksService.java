package com.api.kanban.Service;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.ColumnsDTO;
import com.api.kanban.DTO.TasksDTO;
import com.api.kanban.Entity.Tasks;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Repository.ColumnsRepository;
import com.api.kanban.Repository.TasksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
public class TasksService {
    @Autowired
    private TasksRepository tasksRepository;
    @Autowired
    private ColumnsRepository columnsRepository;

    public Tasks createNewTask(TasksDTO dto, long columnId) {
        Columns col = columnsRepository.findById(columnId).orElseThrow(() -> new NoSuchElementException("column not found"));
        Tasks existingTask = tasksRepository.findTasksByTaskTitleIgnoreCase(dto.getTaskTitle()).orElse(null);

        if (existingTask != null) {
            throw new ResourceConflictException("a task with this title already exists");
        }

        Tasks task = new Tasks();
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        task.setTaskTitle(dto.getTaskTitle());
        task.setColumn(col);
        task.setStatusColumn(col.getStatusTitle());

        if (dto.getDescription() != null) {
            task.setDescription(dto.getDescription());
        }

        tasksRepository.save(task);
        return task;
    }

    public Tasks editTask(TasksDTO dto, long taskId) {
        Tasks task = tasksRepository.findById(taskId).orElseThrow(() -> new NoSuchElementException("task not found"));

        if (dto.getTaskTitle() != null && !dto.getTaskTitle().equalsIgnoreCase(task.getTaskTitle())) {
            task.setTaskTitle(dto.getTaskTitle());
        }
        if (dto.getTaskTitle() != null) {
            task.setDescription(dto.getDescription());
        }
        task.setUpdatedAt(LocalDateTime.now());

        tasksRepository.save(task);
        return task;
    }
 // move a task by drag & drop. find col by id of col task was dropped into and update accordingly
    public Tasks moveTask(long columnId, long taskId) {
        Tasks task = tasksRepository.findById(taskId).orElseThrow(() -> new NoSuchElementException("task not found"));
        Columns column = columnsRepository.findById(columnId).orElseThrow(() -> new NoSuchElementException("column not found"));

        task.setStatusColumn(column.getStatusTitle());
        task.setColumn(column);
        task.setUpdatedAt(LocalDateTime.now());

        tasksRepository.save(task);
        return task;
    }
// move a task by updating status. user inputs status and if exists as col, update accordingly to move task into col
    public Tasks updateTaskStatus(ColumnsDTO status, long taskId) {
        Tasks task = tasksRepository.findById(taskId).orElseThrow(() -> new NoSuchElementException("task not found"));
        Columns column = columnsRepository.findByStatusTitleIgnoreCase(status.getStatusTitle()).orElseThrow(() -> new NoSuchElementException("column not found"));

        task.setUpdatedAt(LocalDateTime.now());
        task.setStatusColumn(column.getStatusTitle());
        task.setColumn(column);

        tasksRepository.save(task);
        return task;
    }

    public void deleteTask(long taskId) {
        tasksRepository.deleteById(taskId);
    }
}
