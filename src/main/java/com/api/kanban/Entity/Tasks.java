package com.api.kanban.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class Tasks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private LocalDateTime createdAt;
    private String taskTitle;
    private String description;
    private String statusColumn;
    @ManyToOne
    private Columns column;
    @OneToMany
    private List<Subtasks> subtasksList;
}
