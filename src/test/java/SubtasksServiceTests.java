import com.api.kanban.DTO.IsCompleteDTO;
import com.api.kanban.DTO.SubtasksDTO;
import com.api.kanban.DTO.SubtasksDetailsDTO;
import com.api.kanban.Entity.Subtasks;
import com.api.kanban.Entity.Tasks;
import com.api.kanban.Repository.SubtasksRepository;
import com.api.kanban.Repository.TasksRepository;
import com.api.kanban.Service.SubtasksService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SubtasksServiceTests {
    @Mock
    private SubtasksRepository subtasksRepository;
    @Mock
    private TasksRepository tasksRepository;
    @InjectMocks
    private SubtasksService subtasksService;

    @Test
    void addNewSubtask_shouldCreateSubtask() {
        Tasks t = new Tasks();
        when(tasksRepository.findById(1L)).thenReturn(Optional.of(t));
        when(subtasksRepository.save(any(Subtasks.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SubtasksDTO dto = new SubtasksDTO();
        dto.setSubtaskTitle("clean up unit tests");

        SubtasksDetailsDTO st = subtasksService.addNewSubtask(dto, 1L);

        assertEquals("clean up unit tests", st.getSubtaskTitle());
        //assertEquals(t, st.getTask());
    }

    @Test
    void editSubtask_shouldChangeTitle() {
        Tasks task = new Tasks();
        task.setId(1L);
        Subtasks st = new Subtasks();
        st.setSubtaskTitle("clean up unit tests");
        st.setTask(task);
        when(subtasksRepository.findById(1L)).thenReturn(Optional.of(st));
        when(subtasksRepository.save(any(Subtasks.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SubtasksDTO dto = new SubtasksDTO();
        dto.setSubtaskTitle("test business logic");

        subtasksService.editSubtask(dto, 1L);

        assertEquals("test business logic", st.getSubtaskTitle());
    }

    @Test
    void markAsComplete_subtaskShouldSaveAsCompleted() {
        Subtasks st = new Subtasks();
        st.setComplete(false);
        when(subtasksRepository.findById(1L)).thenReturn(Optional.of(st));
        when(subtasksRepository.save(any(Subtasks.class))).thenAnswer(invocation -> invocation.getArgument(0));

        IsCompleteDTO dto = new IsCompleteDTO();
        dto.setComplete(true);

        subtasksService.markAsComplete(dto, 1L);

        assertTrue(st.isComplete());
    }
}
