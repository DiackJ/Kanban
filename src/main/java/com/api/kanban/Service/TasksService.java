package com.api.kanban.Service;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.ColumnsDTO;
import com.api.kanban.DTO.SubtasksDetailsDTO;
import com.api.kanban.DTO.TasksDTO;
import com.api.kanban.DTO.TasksDetailsDTO;
import com.api.kanban.Entity.Tasks;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Repository.ColumnsRepository;
import com.api.kanban.Repository.SubtasksRepository;
import com.api.kanban.Repository.TasksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TasksService {
    @Autowired
    private TasksRepository tasksRepository;
    @Autowired
    private ColumnsRepository columnsRepository;
    @Autowired
    private SubtasksRepository subtasksRepository;

    public TasksDetailsDTO createNewTask(TasksDTO dto, long columnId) {
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
        return new TasksDetailsDTO(
                task.getId(),
                task.getTaskTitle(),
                task.getStatusColumn(),
                task.getColumn().getId()
        );
    }

    public TasksDetailsDTO editTask(TasksDTO dto, long taskId) {
        Tasks task = tasksRepository.findById(taskId).orElseThrow(() -> new NoSuchElementException("task not found"));

        if (dto.getTaskTitle() != null && !dto.getTaskTitle().equalsIgnoreCase(task.getTaskTitle())) {
            task.setTaskTitle(dto.getTaskTitle());
        }
        if (dto.getTaskTitle() != null) {
            task.setDescription(dto.getDescription());
        }
        task.setUpdatedAt(LocalDateTime.now());

        tasksRepository.save(task);
        return new TasksDetailsDTO(
                task.getId(),
                task.getTaskTitle()
        );
    }
 // move a task by drag & drop. find col by id of col task was dropped into and update accordingly
    public TasksDetailsDTO moveTask(long columnId, long taskId) {
        Tasks task = tasksRepository.findById(taskId).orElseThrow(() -> new NoSuchElementException("task not found"));
        Columns column = columnsRepository.findById(columnId).orElseThrow(() -> new NoSuchElementException("column not found"));

        task.setStatusColumn(column.getStatusTitle());
        task.setColumn(column);
        task.setUpdatedAt(LocalDateTime.now());

        tasksRepository.save(task);
        return new TasksDetailsDTO(
                task.getId(),
                task.getTaskTitle(),
                task.getStatusColumn(),
                task.getColumn().getId()
        );
    }
// move a task by updating status. user inputs status and if exists as col, update accordingly to move task into col
    public TasksDetailsDTO updateTaskStatus(ColumnsDTO status, long taskId) {
        Tasks task = tasksRepository.findById(taskId).orElseThrow(() -> new NoSuchElementException("task not found"));
        Columns column = columnsRepository.findByStatusTitleIgnoreCase(status.getStatusTitle()).orElseThrow(() -> new NoSuchElementException("column not found"));

        task.setUpdatedAt(LocalDateTime.now());
        task.setStatusColumn(column.getStatusTitle());
        task.setColumn(column);

        tasksRepository.save(task);
        return new TasksDetailsDTO(
                task.getId(),
                task.getTaskTitle(),
                task.getStatusColumn(),
                task.getColumn().getId()
        );
    }

    public TasksDetailsDTO getTasks(long id) {
        Tasks task = tasksRepository.findById(id).orElseThrow(() -> new NoSuchElementException("task not found"));

        List<SubtasksDetailsDTO> subtasks = task.getSubtasksList().stream().map(st -> new SubtasksDetailsDTO(
                st.getId(),
                st.getSubtaskTitle(),
                st.isComplete(),
                st.getTask().getId()
        )).toList();

        int completedTasks = subtasksRepository.findIsComplete(true).size();
        int incompleteTasks = subtasksRepository.findIsComplete(false).size();

        return new TasksDetailsDTO(
                task.getId(),
                task.getTaskTitle(),
                task.getStatusColumn(),
                completedTasks,
                incompleteTasks,
                subtasks
        );
    }

    public void deleteTask(long taskId) {
        tasksRepository.deleteById(taskId);
    }
}
