import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.ColumnsDTO;
import com.api.kanban.DTO.TasksDTO;
import com.api.kanban.Entity.Tasks;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Repository.ColumnsRepository;
import com.api.kanban.Repository.TasksRepository;
import com.api.kanban.Service.TasksService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTests {
    @Mock
    private TasksRepository tasksRepository;
    @Mock
    private ColumnsRepository columnsRepository;
    @InjectMocks
    private TasksService tasksService;

    @Test
    void createNewTask_shouldCreateANewTask() {
        Columns col = new Columns();
        when(columnsRepository.findById(1L)).thenReturn(Optional.of(col));
        when(tasksRepository.save(any(Tasks.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TasksDTO dto = new TasksDTO();
        dto.setTaskTitle("implement backend logic");

        Tasks task = tasksService.createNewTask(dto, 1L);

        assertEquals("implement backend logic", task.getTaskTitle());
        assertEquals(col, task.getColumn());
    }

    @Test
    void createDupeTask_shouldThrowConflictException() throws ResourceConflictException {
        Tasks t = new Tasks();
        t.setTaskTitle("implement backend");
        Columns c = new Columns();
        when(columnsRepository.findById(1L)).thenReturn(Optional.of(c));
        when(tasksRepository.findTasksByTaskTitleIgnoreCase(argThat(s -> s.equalsIgnoreCase(t.getTaskTitle())))).thenReturn(Optional.of(t));

        TasksDTO dto = new TasksDTO();
        dto.setTaskTitle("Implement Backend");

        assertThrows(ResourceConflictException.class, () -> {
            tasksService.createNewTask(dto, 1L);
        });
    }

    @Test
    void editTask_shouldChangeTaskTitle() {
        Tasks t = new Tasks();
        t.setTaskTitle("implement backend");
        when(tasksRepository.findById(1L)).thenReturn(Optional.of(t));
        when(tasksRepository.save(any(Tasks.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TasksDTO dto = new TasksDTO();
        dto.setTaskTitle("update db schema");

        tasksService.editTask(dto, 1L);

        assertEquals("update db schema", t.getTaskTitle());
    }

    @Test
    void moveTask_shouldUpdateStatusOfTask() {
        // old / current col
        Columns oldCol = new Columns();
        // task to move
        Tasks t = new Tasks();
        t.setStatusColumn("To Do");
        t.setColumn(oldCol); // current col of the task is the "old column"
        // new col to move task to
        Columns newCol = new Columns();
        newCol.setStatusTitle("In Progress");
        // look for & return new col
        when(columnsRepository.findById(2L)).thenReturn(Optional.of(newCol));

        when(tasksRepository.findById(1L)).thenReturn(Optional.of(t));
        when(tasksRepository.save(any(Tasks.class))).thenAnswer(invocation -> invocation.getArgument(0));

        tasksService.moveTask(2L, 1L);

        assertEquals(newCol, t.getColumn()); // check that task col got updated (task moved)
        assertEquals("In Progress", t.getStatusColumn()); // check that status was updated to new col status
    }

    @Test
    void updateTaskStatus_shouldMoveTask() {
        // current col
        Columns oldCol = new Columns();
        // task to move
        Tasks t = new Tasks();
        t.setStatusColumn("To Do");
        t.setColumn(oldCol);
        // new col to move task to
        Columns newCol = new Columns();
        newCol.setStatusTitle("In Progress");
        // locate new col
        when(columnsRepository.findByStatusTitleIgnoreCase(newCol.getStatusTitle())).thenReturn(Optional.of(newCol));
        // get and save task
        when(tasksRepository.findById(1L)).thenReturn(Optional.of(t));
        when(tasksRepository.save(any(Tasks.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ColumnsDTO dto = new ColumnsDTO();
        dto.setStatusTitle("In Progress");

        tasksService.updateTaskStatus(dto, 1L);

        assertEquals(newCol, t.getColumn()); // check task was moved
        assertEquals("In Progress", t.getStatusColumn()); // check status was updated
    }
}
