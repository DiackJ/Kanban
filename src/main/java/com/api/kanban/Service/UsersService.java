package com.api.kanban.Service;

import com.api.kanban.DTO.SignupRequest;
import com.api.kanban.DTO.UsersDTO;
import com.api.kanban.DTO.VerifyRequest;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.security.SecureRandom;
import java.util.Random;


@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JavaMailSender mailSender;

    // add a new user
    public void addNewUser(SignupRequest dto) {
        Users existingUser = usersRepository.findByEmail(dto.getEmail()).orElse(null);

        if (existingUser != null) {
            throw new IllegalArgumentException("User already exists with this email.");
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

    }

    public Users verifyAccount(VerifyRequest req, String email) {
        Users user = usersRepository.findByEmail(email).orElseThrow(() -> new ResourceAccessException("user not found"));

        if (req.getCode() != user.getVerificationCode()) {
            throw new IllegalArgumentException("Verification code is incorrect");
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        return usersRepository.save(user);
    }
}
