package com.api.kanban.Repository;

import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Columns;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ColumnsRepository extends JpaRepository<Columns, Long> {
    @Query("SELECT c FROM Columns c WHERE c.statusTitle = :statusTitle AND c.board.id = :boardId")
    Optional<Columns> findByStatusTitleIgnoreCase(@Param("statusTitle") String statusTitle, @Param("boardId") long boardId);

    @Query("SELECT c FROM Columns c WHERE c.board.id = :boardId")
    List<Columns> findAllColumnsByBoardId(@Param("boardId") long boardId);
}
