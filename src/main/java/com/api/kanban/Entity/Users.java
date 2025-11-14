package com.api.kanban.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Entity
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String displayName;
    private String email;
    @JsonIgnore
    private String passwordHash;
    private Integer verificationCode;
    private boolean enabled;
    @OneToMany
    private List<Boards> boardsList;
}
