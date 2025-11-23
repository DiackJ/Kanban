import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.BoardsDTO;
import com.api.kanban.DTO.EditBoardRequest;
import com.api.kanban.DTO.GetBoardDetailsDTO;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.ColumnsRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BoardServiceTests {
    @Mock
    private BoardsRepository boardsRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private ColumnsRepository columnsRepository;
    @InjectMocks
    private BoardsService boardsService;

    @Test
    void newBoard_shouldCreateNewBoard() {
        Users user = new Users();
        UUID id = UUID.randomUUID();
        user.setId(id);
        user.setEnabled(true);
        user.setEmail("test@test.com");
        when(usersRepository.findById(user.getId())).thenReturn(Optional.of(user));

        when(boardsRepository.save(any(Boards.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BoardsDTO dto = new BoardsDTO();
        dto.setBoardTitle("Coding Project");
        dto.setDescription("this board is for my new project");

        GetBoardDetailsDTO board = boardsService.createNewBoard(dto, user.getId());

        assertEquals("Coding Project", board.getBoardTitle());
        assertEquals("this board is for my new project", board.getDescription());
    }

    @Test
    void newBoardWithExistingTitle_shouldThrowException() {
        Users user = new Users();
        UUID id = UUID.randomUUID();
        user.setId(id);
        user.setEnabled(true);
        user.setEmail("test@test.com");
        when(usersRepository.findById(user.getId())).thenReturn(Optional.of(user));

        Boards existingBoard = new Boards();
        when(boardsRepository.findByBoardTitleIgnoreCase("Coding Project", user.getId())).thenReturn(Optional.of(existingBoard));

        BoardsDTO dto = new BoardsDTO();
        dto.setBoardTitle("Coding Project");

        assertThrows(ResourceConflictException.class, () -> {
            boardsService.createNewBoard(dto, user.getId());
        });
    }

    @Test
    void editBoard_shouldChangeBoardFields() {
        Boards board = new Boards();
        board.setId(1L);
        board.setBoardTitle("Coding Project");
        board.setDescription("this is a board for my project");
        when(boardsRepository.findById(1L)).thenReturn(Optional.of(board));
        when(boardsRepository.save(any(Boards.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EditBoardRequest edit = new EditBoardRequest();
        edit.setBoardTitle("Personal Coding Project");
        // "boardTitle": "Personal Coding Project",
        // "description": null

        boardsService.editBoard(edit, 1L);

        assertEquals("Personal Coding Project", board.getBoardTitle());
        assertEquals("this is a board for my project", board.getDescription());
    }

    @Test
    void editBoard_shouldKeepOriginalBoardFields() {
        Boards board = new Boards();
        board.setId(1L);
        board.setBoardTitle("Coding Project");
        board.setDescription("this is a board for my project");
        when(boardsRepository.findById(1L)).thenReturn(Optional.of(board));
        when(boardsRepository.save(any(Boards.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EditBoardRequest edit = new EditBoardRequest();
        edit.setBoardTitle(null);
        edit.setDescription(null);

        boardsService.editBoard(edit, 1L);

        assertEquals("Coding Project", board.getBoardTitle());
        assertEquals("this is a board for my project", board.getDescription());
    }

    @Test
    void deleteBoard_shouldRemoveBoardFromRepo() {
        Boards board = new Boards();
        board.setId(1L);

        boardsService.deleteBoard(1L);

        verify(boardsRepository).deleteById(1L);
    }
}
