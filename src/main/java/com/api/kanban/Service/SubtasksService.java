package com.api.kanban.Service;

import com.api.kanban.DTO.IsCompleteDTO;
import com.api.kanban.DTO.SubtasksDTO;
import com.api.kanban.DTO.SubtasksDetailsDTO;
import com.api.kanban.Entity.Subtasks;
import com.api.kanban.Entity.Tasks;
import com.api.kanban.Repository.SubtasksRepository;
import com.api.kanban.Repository.TasksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class SubtasksService {
    @Autowired
    private SubtasksRepository subtasksRepository;
    @Autowired
    private TasksRepository tasksRepository;

    public SubtasksDetailsDTO addNewSubtask(SubtasksDTO dto, long taskId) {
        Tasks task = tasksRepository.findById(taskId).orElseThrow(() -> new NoSuchElementException("task not found"));

        Subtasks st = new Subtasks();
        st.setSubtaskTitle(dto.getSubtaskTitle());
        st.setTask(task);
        st.setComplete(false);

        subtasksRepository.save(st);
        return new SubtasksDetailsDTO(
                st.getId(),
                st.getSubtaskTitle(),
                st.isComplete(),
                st.getTask().getId()
        );
    }

    public SubtasksDetailsDTO editSubtask(SubtasksDTO dto, long id) {
        Subtasks st = subtasksRepository.findById(id).orElseThrow(() -> new NoSuchElementException("subtask not found"));

        st.setSubtaskTitle(dto.getSubtaskTitle());

        subtasksRepository.save(st);
        return new SubtasksDetailsDTO(
                st.getId(),
                st.getSubtaskTitle(),
                st.isComplete(),
                st.getTask().getId()
        );
    }

    public void markAsComplete(IsCompleteDTO dto, long id) {
        Subtasks st = subtasksRepository.findById(id).orElseThrow(() -> new NoSuchElementException("subtask not found"));

        if (dto.isComplete()) {
            st.setComplete(true);
        }
        subtasksRepository.save(st);
    }

    public void removeSubtask(long id) {
        subtasksRepository.deleteById(id);
    }

}
