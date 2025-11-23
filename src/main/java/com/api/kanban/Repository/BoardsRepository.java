package com.api.kanban.Repository;

import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface BoardsRepository extends JpaRepository<Boards, Long> {
    @Query("SELECT b FROM Boards b WHERE b.boardTitle = :boardTitle AND b.user.id = :userId")
    Optional<Boards> findByBoardTitleIgnoreCase(@Param("boardTitle") String boardTitle, @Param("userId") UUID userId);
}
