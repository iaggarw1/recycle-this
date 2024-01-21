package com.backend.service.impl;

import com.auth0.client.auth.AuthAPI;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.TokenHolder;
import com.backend.service.AuthUserService;
import com.backend.user.AuthUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthUserServiceImpl implements AuthUserService {

    @Autowired
    private AuthAPI authAPI;

    @Value("${auth0.audience}")
    private String audience;

    @Override
    public AuthUser authenticateWithAuth0(String username, String password) throws Auth0Exception {
        TokenHolder tokenHolder = authAPI
                .login(username, password)
                .setAudience(audience)
                .execute();

        // Decode the JWT without a custom signing key resolver
        Jws<Claims> claimsJws = Jwts.parser()
                .setSigningKey("your-client-secret".getBytes()) // Replace with your actual client secret
                .parseClaimsJws(tokenHolder.getAccessToken());

        // Extract user information from the claims
        Claims claims = claimsJws.getBody();

        AuthUser authUser = new AuthUser();
        authUser.setId(claims.getSubject()); // Assuming 'sub' is the user ID in the Auth0 token
        authUser.setName(claims.get("name", String.class)); // Assuming 'name' is the userName in the Auth0 token
        authUser.setEmail(claims.get("email", String.class)); // Assuming 'email' is the user email in the Auth0 token

        return authUser;
    }
}
