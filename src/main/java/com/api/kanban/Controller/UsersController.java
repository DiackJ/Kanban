package com.api.kanban.Controller;

import com.api.kanban.DTO.SignupRequest;
import com.api.kanban.DTO.VerifyRequest;
import com.api.kanban.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsersController {
    @Autowired
    private UsersService usersService;

    @PutMapping("/auth/api/v1/user")
    public ResponseEntity<String> addNewUser(@RequestBody SignupRequest dto) {
        usersService.addNewUser(dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("verification code sent to " + dto.getEmail());
    }

    @PutMapping("/auth/api/v1/verification")
    public ResponseEntity<String> verifyUser(@RequestBody VerifyRequest req) {
        usersService.verifyAccount(req, req.getEmail());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("account verified");
    }
}
