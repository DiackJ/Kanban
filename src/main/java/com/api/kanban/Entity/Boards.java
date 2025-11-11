package com.api.kanban.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class Boards {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private LocalDateTime createdAt;
    private String boardTitle;
    private String description;
    @ManyToOne
    private Users user;
    @OneToMany
    private List<Columns> columnsList;
}
