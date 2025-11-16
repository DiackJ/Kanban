import com.api.kanban.DTO.SignupRequest;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.UsersRepository;
import com.api.kanban.Service.UsersService;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private PasswordEncoder encoder;
    @Mock
    private JavaMailSender mailSender;
    @InjectMocks
    private UsersService usersService;

    @Test
    void createNewUser_shouldCreateUser() {
        when(usersRepository.save(any(Users.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SignupRequest dto = new SignupRequest();
        dto.setEmail("test@test.com");
        dto.setPasswordHash("somecoolpassword123");

        Users user = usersService.addNewUser(dto);

        assertEquals("test@test.com", user.getEmail());
        assertFalse(user.isEnabled());
        assertNotNull(user.getVerificationCode());
        // verify that we made it to the email part and that send() was actually called to send a message
        verify(mailSender).send(any(SimpleMailMessage.class));

        // note-to-self: UUIDs do not get generated for unit tests so this line is always false.
        //assertNotNull(user.getId());
    }

    @Test
    void createExistingUser_shouldNotCreateUser() {
        Users existingUser = new Users();
        when(usersRepository.findByEmail("test@test.com")).thenReturn(Optional.of(existingUser));

        SignupRequest dto = new SignupRequest();
        dto.setEmail("test@test.com");
        dto.setPasswordHash("somecoolpassword123");

        assertThrows(IllegalArgumentException.class, () -> {
            usersService.addNewUser(dto);
        });
    }
}
