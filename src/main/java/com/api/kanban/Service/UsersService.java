package com.api.kanban.Service;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.DTO.*;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.SubtasksRepository;
import com.api.kanban.Repository.UsersRepository;
import com.api.kanban.Util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.security.SecureRandom;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private BoardsRepository boardsRepository;
    @Autowired
    private SubtasksRepository subtasksRepository;
    @Value("${APP_EMAIL}")
    private String emailSender;

    // add a new user
    public UserDetailsDTO addNewUser(SignupRequest dto) {
        Users existingUser = usersRepository.findByEmail(dto.getEmail()).orElse(null);

        if (existingUser != null) {
            throw new ResourceConflictException("User already exists with this email.");
        }

        Users user = new Users();
        user.setEmail(dto.getEmail());
        user.setDisplayName(dto.getEmail().substring(0, dto.getEmail().indexOf("@")));
        user.setPasswordHash(encoder.encode(dto.getPasswordHash()));

        SecureRandom random = new SecureRandom();
        Integer verificationCode = 100000 + random.nextInt(900000);
        user.setVerificationCode(verificationCode);
        user.setEnabled(false);

        usersRepository.save(user);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("lisa74@ethereal.email");
        message.setTo(dto.getEmail());
        message.setSubject("kanban verification code");
        message.setText("Your kanban verification code is: " + verificationCode);
        mailSender.send(message);

        return new UserDetailsDTO(
                user.getEmail(),
                user.isEnabled()
        );
    }

    public Users verifyAccount(VerifyRequest req, String email) {
        Users user = usersRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("an error occurred. please try again"));
        System.out.println(user.getVerificationCode());

        if (!Objects.equals(req.getCode(), user.getVerificationCode())) {
            throw new IllegalArgumentException("Verification code is incorrect");
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        return usersRepository.save(user);
    }

    public Users getUser(HttpServletRequest req) throws ResourceAccessException{
        String token = jwtUtil.extractTokenFromCookie(req);
        String email = jwtUtil.extractEmail(token);

        return usersRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("an error occurred. please try again"));
    }

    // return a list of board objs that contain the title and id for navigation
    public List<GetBoardNavDTO> getNavInfo(Users user) {
        List<Boards> boards = user.getBoardsList();

        return boards.stream().map(b -> new GetBoardNavDTO(
                b.getBoardTitle(),
                b.getId()
        )).toList();
    }

    // return the details for the currently selected board
    public GetBoardDetailsDTO getCurrentBoard(long id) {
        Boards b = boardsRepository.findById(id).orElseThrow(() -> new NoSuchElementException("This board could not be found."));

        // get each column of the board
        // ok this nested stream stuff really needs to get cleaned up for real..so inefficient bro its like O(n^3)
        List<ColumnsDetailsDTO> colList = b.getColumnsList().stream().map(col -> new ColumnsDetailsDTO(
                col.getId(),
                col.getStatusTitle(),
                col.getTasksList().stream().map(t -> new TasksDetailsDTO(
                        t.getId(),
                        t.getTaskTitle(),
                        t.getColumn().getId(),
                        t.getStatusColumn(),
                        subtasksRepository.findIsComplete(true, t.getId()).size(),
                        subtasksRepository.findIsComplete(false, t.getId()).size(),
                        t.getSubtasksList().stream().map(st -> new SubtasksDetailsDTO(
                                st.getId(),
                                st.getSubtaskTitle(),
                                st.isComplete(),
                                st.getTask().getId()
                        )).toList(),
                        t.getOrderNum()
                )).toList()
        )).toList();


        return new GetBoardDetailsDTO(
                b.getId(),
                b.getBoardTitle(),
                b.getDescription(),
                b.getUser().getId(),
                colList
        );
    }

    // regenerate and resend a new verification code
    public void resendNewVerificationCode(VerifyRequest dto) {
        Users user = usersRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("an error occurred. please try again"));

        SecureRandom random = new SecureRandom();
        Integer code = 100000 + random.nextInt(900000);

        user.setVerificationCode(code);
        usersRepository.save(user);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(dto.getEmail());
        message.setSubject("kanban verification code");
        message.setText("Your new kanban verification code is: " + code);
        mailSender.send(message);
    }

}
