package com.api.kanban.Repository;

import com.api.kanban.Entity.Subtasks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubtasksRepository extends JpaRepository<Subtasks, Long> {
    @Query("SELECT s FROM Subtasks WHERE e.isComplete = :val")
    List<Subtasks> findIsComplete(@Param("val") boolean val);
}
