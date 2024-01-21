package com.backend.controller;

import com.auth0.exception.Auth0Exception;
import com.backend.exception.UserAlreadyExistsException;
import com.backend.service.AuthUserService;
import com.backend.service.UserService;
import com.backend.user.AuthUser;
import com.backend.user.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthUserService authUserService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDto userDto) {
        try {
            userService.registerUser(userDto);
            System.out.println("User registered successfully");
            return ResponseEntity.ok("User registered successfully");
        }
        catch (UserAlreadyExistsException e) {
            return new ResponseEntity<>("User with this email already exists.", HttpStatus.BAD_REQUEST);
        } catch (Throwable t) {
            // Handle other exceptions
            return new ResponseEntity<>("An error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserDto userDto) {
        if (userDto.isAuth0Login()) {
            try {
                AuthUser authUser = authUserService.authenticateWithAuth0(userDto.getEmail(), userDto.getPassword());

                System.out.println("Auth0 Login successful");
                System.out.println("User ID: " + authUser.getId());
                System.out.println("User Name: " + authUser.getName());
                System.out.println("User Email: " + authUser.getEmail());

                return ResponseEntity.ok("Auth0 Login successful");
            } catch (Auth0Exception e) {
                return ResponseEntity.status(401).body("Invalid Auth0 credentials");
            }
        } else {
            if(userService.loginUser(userDto)) {
                System.out.println("Login successful");
                return ResponseEntity.ok("Login successful");
            }
            else
            {
                return new ResponseEntity<>("Invalid Password or User does not exist", HttpStatus.UNAUTHORIZED);
            }
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(@RequestBody UserDto userDto) {
        try {
            userService.logoutUser(userDto.getEmail());
            return ResponseEntity.ok("Logout successful");
        } catch (Throwable t) {
            return new ResponseEntity<>("An error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
