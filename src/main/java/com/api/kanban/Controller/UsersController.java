package com.api.kanban.Controller;

import com.api.kanban.DTO.BoardDetailsDTO;
import com.api.kanban.DTO.GetBoardDTO;
import com.api.kanban.DTO.SignupRequest;
import com.api.kanban.DTO.VerifyRequest;
import com.api.kanban.Entity.Users;
import com.api.kanban.Service.UsersService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UsersController {
    @Autowired
    private UsersService usersService;

    // make a request to sign up
    @PostMapping("/auth/api/v1/user")
    public ResponseEntity<String> addNewUser(@RequestBody SignupRequest dto) {
        usersService.addNewUser(dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("verification code sent to " + dto.getEmail());
    }

    // make a request to verify new account
    @PostMapping("/auth/api/v1/verification")
    public ResponseEntity<String> verifyUser(@RequestBody VerifyRequest req) {
        usersService.verifyAccount(req, req.getEmail());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("account verified");
    }

    // make a request to get list of boards for nav bar
    @GetMapping("/api/v1/nav")
    public ResponseEntity<List<GetBoardDTO>> getNavigation(HttpServletRequest req) {
        Users user = usersService.getUser(req);

        List<GetBoardDTO> boards = usersService.getNavInfo(user);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(boards);
    }

    // make request to get the currently selected board's details
    @GetMapping("api/v1/board/{id}")
    public ResponseEntity<BoardDetailsDTO> getBoardDetails(@PathVariable long id) {
        BoardDetailsDTO details = usersService.getCurrentBoard(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(details);
    }
}
