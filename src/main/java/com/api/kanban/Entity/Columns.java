package com.api.kanban.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
public class Columns {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String statusTitle;
    @ManyToOne
    private Boards board;
    @OneToMany
    private List<Tasks> tasksList;
}
