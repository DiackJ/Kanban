package com.api.kanban.Repository;

import com.api.kanban.Entity.Subtasks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubtasksRepository extends JpaRepository<Subtasks, Long> {
    @Query("SELECT s FROM Subtasks s WHERE s.isComplete = :val AND s.task.id = :taskId")
    List<Subtasks> findIsComplete(@Param("val") boolean val, @Param("taskId") long taskId);
}
