package com.api.kanban.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Subtasks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String subtask_title;
    private boolean isComplete;
    @ManyToOne
    private Tasks task;
}
