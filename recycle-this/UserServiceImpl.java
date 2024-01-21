package com.backend.service.impl;

import com.backend.exception.UserAlreadyExistsException;
import com.backend.repository.UserRepository;
import com.backend.service.UserService;
import com.backend.user.User;
import com.backend.user.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void registerUser(UserDto userDto) {
        User existingUser = findByEmail(userDto.getEmail());
        if (existingUser != null) {
            throw new UserAlreadyExistsException("User with this email already exists.");
        }
        User newUser = new User();
        newUser.setName(userDto.getName());
        newUser.setEmail(userDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userRepository.save(newUser);
    }

    @Override
    public boolean loginUser(UserDto userDto) {
        String email = userDto.getEmail();
        String password = userDto.getPassword();
        User user = userRepository.findByEmail(email);

        if (user != null && passwordEncoder.matches(password, user.getPassword()))
        {
            user.setLoggedIn(true);
            userRepository.save(user);
            return true;
        }
        else
        {
            System.out.println("Invalid regular login credentials");
            return false;
        }
    }

    @Override
    public void logoutUser(String userEmail) {
        User user = findByEmail(userEmail);
        if (user != null) {
            user.setLoggedIn(false);
            userRepository.save(user);
        }
    }

    @Override
    public User findByEmail(String email) {
        User user = userRepository.findByEmail(email.toLowerCase());
        return user;
    }
}
