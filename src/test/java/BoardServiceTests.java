import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.BoardsDTO;
import com.api.kanban.DTO.ColumnsDTO;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Columns;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.UsersRepository;
import com.api.kanban.Service.BoardsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BoardServiceTests {
    @Mock
    private BoardsRepository boardsRepository;
    @Mock
    private UsersRepository usersRepository;
    @InjectMocks
    private BoardsService boardsService;

    @Test
    void newBoard_shouldCreateNewBoard() {
        Users user = new Users();
        UUID id = UUID.randomUUID();
        user.setId(id);
        user.setEnabled(true);
        user.setEmail("test@test.com");

        when(boardsRepository.save(any(Boards.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BoardsDTO dto = new BoardsDTO();
        dto.setBoardTitle("Coding Project");
        dto.setDescription("this board is for my new project");

        Boards board = boardsService.createNewBoard(dto, user);

        assertEquals("Coding Project", board.getBoardTitle());
        assertEquals("this board is for my new project", board.getDescription());
        assertNotNull(board.getColumnsList());
    }

    @Test
    void newBoardWithExistingTitle_shouldThrowException() {
        Users user = new Users();
        UUID id = UUID.randomUUID();
        user.setId(id);
        user.setEnabled(true);
        user.setEmail("test@test.com");

        Boards existingBoard = new Boards();
        when(boardsRepository.findByBoardTitle("Coding Project")).thenReturn(Optional.of(existingBoard));

        BoardsDTO dto = new BoardsDTO();
        dto.setBoardTitle("Coding Project");

        assertThrows(ResourceConflictException.class, () -> {
            boardsService.createNewBoard(dto, user);
        });
    }
}
