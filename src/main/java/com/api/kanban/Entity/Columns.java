package com.api.kanban.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Columns {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String statusTitle;
    @ManyToOne
    @JoinColumn(name ="board_id")
    private Boards board;
    @OneToMany(mappedBy = "column", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tasks> tasksList;

    public Columns(){}

    public Columns(String statusTitle, Boards board) {
        this.statusTitle = statusTitle;
        this.board = board;
    }
}
