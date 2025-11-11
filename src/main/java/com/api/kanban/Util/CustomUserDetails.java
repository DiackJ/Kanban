package com.api.kanban.Util;

import com.api.kanban.Entity.Users;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class CustomUserDetails implements UserDetails {
    private String username;
    private String password;
    @Getter
    private UUID id;

    public CustomUserDetails(Users users) {
        this.username = users.getEmail();
        this.password = users.getPasswordHash();
        this.id = users.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }
}
