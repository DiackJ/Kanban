package com.api.kanban.Service;

import com.api.kanban.CustomException.ResourceConflictException;
import com.api.kanban.CustomException.ResourceNotFound;
import com.api.kanban.DTO.*;
import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.BoardsRepository;
import com.api.kanban.Repository.UsersRepository;
import com.api.kanban.Util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.security.SecureRandom;
import java.util.List;

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

    // add a new user
    public Users addNewUser(SignupRequest dto) {
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
        message.setTo(dto.getEmail());
        message.setSubject("kanban verification code");
        message.setText("Your kanban verification code is: " + verificationCode);
        mailSender.send(message);

        return user;
    }

    public Users verifyAccount(VerifyRequest req, String email) {
        Users user = usersRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found."));
        System.out.println(user.getVerificationCode());

        if (req.getCode() != user.getVerificationCode()) {
            throw new IllegalArgumentException("Verification code is incorrect");
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        return usersRepository.save(user);
    }

    public Users getUser(HttpServletRequest req) throws ResourceAccessException{
        String token = jwtUtil.extractTokenFromCookie(req);
        String email = jwtUtil.extractEmail(token);

        return usersRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found."));
    }

    // return a list of board objs that contain the title and id for navigation
    public List<GetBoardDTO> getNavInfo(Users user) {
        List<Boards> boards = user.getBoardsList();

        return boards.stream().map(b -> new GetBoardDTO(
                b.getBoardTitle(),
                b.getId()
        )).toList();
    }

    // return the details for the currently selected board
    public BoardDetailsDTO getCurrentBoard(long id) {
        Boards b = boardsRepository.findById(id).orElseThrow(() -> new ResourceNotFound("This board could not be found."));
        BoardDetailsDTO board = new BoardDetailsDTO();

        // get each column of the board
        List<GetColumnsDTO> c = b.getColumnsList().stream().map(col -> {
            GetColumnsDTO dto = new GetColumnsDTO();
            dto.setId(col.getId());
            dto.setStatusTitle(col.getStatusTitle());

            // for each column get each task list
            List<GetTasksDTO> tasks = col.getTasksList().stream().map(t -> new GetTasksDTO(
                    t.getId(),
                    t.getTaskTitle()
            )).toList();

            dto.setTasks(tasks);
            return dto;
        }).toList();

        board.setBoardTitle(b.getBoardTitle());
        board.setColumns(c);

        return board;
    }

}
