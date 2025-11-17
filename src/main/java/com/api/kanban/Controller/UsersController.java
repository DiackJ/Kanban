package com.api.kanban.Controller;

import com.api.kanban.DTO.*;
import com.api.kanban.Entity.Users;
import com.api.kanban.Service.UsersService;
import com.api.kanban.Util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UsersController {
    @Autowired
    private UsersService usersService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    // make a request to sign up
    @PostMapping("/auth/api/v1/signup")
    public ResponseEntity<String> addNewUser(@RequestBody SignupRequest dto, HttpServletResponse res) {
        Users user = usersService.addNewUser(dto);

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

    // make request to log in
    @PostMapping("/auth/api/v1/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        if (auth.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body("login successful");
        } else {
            throw new BadCredentialsException("Username or password is incorrect.");
        }
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
