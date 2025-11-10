package com.api.kanban.Repository;

import com.api.kanban.Entity.Boards;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardsRepository extends JpaRepository<Long, Boards> {
}
