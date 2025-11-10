package com.api.kanban.Repository;

import com.api.kanban.Entity.Subtasks;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubtasksRepository extends JpaRepository<Long, Subtasks> {
}
