import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.ColumnsDTO;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.ColumnsRepository;
import com.api.kanban.Service.ColumnsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ColumnServiceTests {
    @Mock
    private ColumnsRepository columnsRepository;
    @Mock
    private BoardsRepository boardsRepository;
    @InjectMocks
    private ColumnsService columnsService;

    @Test
    void addNewColumn_shouldCreateNewColumn() {
        Boards board = new Boards();
        when(boardsRepository.findById(1L)).thenReturn(Optional.of(board));
        when(columnsRepository.save(any(Columns.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ColumnsDTO dto = new ColumnsDTO();
        dto.setStatusTitle("Done");

        Columns col = columnsService.addNewColumn(dto, 1L);

        assertEquals("Done", col.getStatusTitle());
        assertEquals(board, col.getBoard());
    }

    @Test
    void addNewDupeColumn_shouldThrowException() throws ResourceConflictException {
        Boards board = new Boards();
        when(boardsRepository.findById(1L)).thenReturn(Optional.of(board));
        Columns col = new Columns();
        when(columnsRepository.findByStatusTitle("Done")).thenReturn(Optional.of(col));

        ColumnsDTO dto = new ColumnsDTO();
        dto.setStatusTitle("Done");

        assertThrows(ResourceConflictException.class, () -> {
            columnsService.addNewColumn(dto, 1L);
        });
    }

    @Test
    void editColumn_shouldChangeStatusTitle() {
        Columns col = new Columns();
        col.setStatusTitle("To Do");
        when(columnsRepository.findById(1L)).thenReturn(Optional.of(col));
        when(columnsRepository.save(any(Columns.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ColumnsDTO dto = new ColumnsDTO();
        dto.setStatusTitle("Urgent");

        Columns c = columnsService.editColumnName(dto, 1L);

        assertEquals("Urgent", c.getStatusTitle());
    }

    @Test
    void editColumnDupeTitle_shouldThrowException() throws ResourceConflictException {
        Columns col = new Columns();
        col.setStatusTitle("To Do");
        when(columnsRepository.findById(1L)).thenReturn(Optional.of(col));

        ColumnsDTO dto = new ColumnsDTO();
        dto.setStatusTitle("To Do");

        assertThrows(ResourceConflictException.class, () -> {
            columnsService.editColumnName(dto, 1L);
        });
    }

    @Test
    void editColumnDupeLowerCase_shouldThrowException() throws ResourceConflictException {
        Columns col = new Columns();
        col.setStatusTitle("To Do");
        when(columnsRepository.findById(1L)).thenReturn(Optional.of(col));

        ColumnsDTO dto = new ColumnsDTO();
        dto.setStatusTitle("to do");

        assertThrows(ResourceConflictException.class, () -> {
            columnsService.editColumnName(dto, 1L);
        });
    }

    @Test
    void deleteColumn_shouldRemoveColumnFromRepo() {
        columnsService.removeColumn(1L);

        verify(columnsRepository).deleteById(1L);
    }

}
