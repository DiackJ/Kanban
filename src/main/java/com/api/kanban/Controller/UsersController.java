package com.api.kanban.Controller;

import com.api.kanban.DTO.*;
import com.api.kanban.Entity.Users;
import com.api.kanban.Repository.UsersRepository;
import com.api.kanban.Service.UsersService;
import com.api.kanban.Util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;

@RestController
public class UsersController {
    @Autowired
    private UsersService usersService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UsersRepository usersRepository;

    // make a request to sign up
    @PostMapping("/auth/api/v1/signup")
    public ResponseEntity<String> addNewUser(@RequestBody SignupRequest dto) {
        if (dto.getEmail() == null) {
            throw new IllegalArgumentException("Email field cannot be blank");
        }
        if (dto.getPasswordHash() == null) {
            throw new IllegalArgumentException("Password field cannot be blank");
        }

        usersService.addNewUser(dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("verification code sent to " + dto.getEmail());
    }

    // make a request to verify new account
    @PostMapping("/auth/api/v1/verification")
    public ResponseEntity<String> verifyUser(@RequestBody VerifyRequest req, HttpServletResponse res) {
        if (req.getCode() == null) {
            throw new IllegalArgumentException("Verification code cannot be blank");
        }

        Users user = usersService.verifyAccount(req, req.getEmail());

        String token = jwtUtil.createToken(user.getId(), user.getEmail());

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // for local host development
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax")
                .build();
        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("account verified");
    }

    // make request to log in
    @PostMapping("/auth/api/v1/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest dto, HttpServletRequest req, HttpServletResponse res) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPasswordHash())
        );
        if (auth.isAuthenticated()) {
            Users user = usersRepository.findByEmail(dto.getEmail()).orElseThrow();
            String token = jwtUtil.createToken(user.getId(), dto.getEmail());
            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .maxAge(Duration.ofDays(7))
                    .path("/")
                    .build();
            res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body("login successful");
        } else {
            throw new BadCredentialsException("Username or password is incorrect.");
        }
    }

    @PostMapping("/auth/api/v1/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse res) {
        ResponseCookie cookie = ResponseCookie.from("jwt")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .maxAge(0) // delete cookie
                .path("/")
                .build();
        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
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

    @PostMapping("/auth/api/v1/reverify")
    public ResponseEntity<String> resendVerification(@RequestBody ReverifyRequest dto) {
        usersService.resendNewVerificationCode(dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("new code sent to " + dto.getEmail());
    }
}
