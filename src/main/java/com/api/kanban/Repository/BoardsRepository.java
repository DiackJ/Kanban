package com.api.kanban.Repository;

import com.api.kanban.Entity.Boards;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardsRepository extends JpaRepository<Boards, Long> {
    Optional<Boards> findByBoardTitleIgnoreCase(String boardTitle);
}
