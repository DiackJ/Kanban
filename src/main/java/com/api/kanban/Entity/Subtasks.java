package com.api.kanban.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Subtasks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String subtaskTitle;
    private boolean isComplete;
    @ManyToOne
    @JoinColumn(name ="task_id")
    private Tasks task;
}
