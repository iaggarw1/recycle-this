package com.backend.user;

public class UserDto {

    private String name;
    private String email;
    private String password;
    private boolean isAuth0Login;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAuth0Login() {
        return isAuth0Login;
    }

    public void setAuth0Login(boolean auth0Login) {
        isAuth0Login = auth0Login;
    }
}
