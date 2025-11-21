package com.api.kanban.Repository;

import com.api.kanban.Entity.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TasksRepository extends JpaRepository<Tasks, Long> {
    Optional<Tasks> findTasksByTaskTitleIgnoreCase(String taskTitle);
}
