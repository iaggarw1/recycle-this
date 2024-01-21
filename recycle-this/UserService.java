package com.backend.service;

import com.backend.user.User;
import com.backend.user.UserDto;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
    void registerUser(UserDto userDto);
    public void logoutUser(String userEmail);
    boolean loginUser(UserDto userDto);
    User findByEmail(String email);
}
