package com.backend.service;

import com.auth0.exception.Auth0Exception;
import com.backend.user.AuthUser;

public interface AuthUserService {

    AuthUser authenticateWithAuth0(String username, String password) throws Auth0Exception;
}
