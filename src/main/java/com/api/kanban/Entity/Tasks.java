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
    @ManyToOne
    @JoinColumn(name = "column_id")
    private Columns column;
    private String statusColumn; // = column.getStatusColumn
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subtasks> subtasksList;
}
