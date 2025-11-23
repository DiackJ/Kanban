package com.api.kanban.Repository;

import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TasksRepository extends JpaRepository<Tasks, Long> {
    @Query("SELECT t FROM Tasks t WHERE t.taskTitle = :taskTitle AND t.column.board.id = :boardId")
    Optional<Tasks> findByTaskTitleIgnoreCase(@Param("taskTitle") String taskTitle, @Param("boardId") long boardId);
}
