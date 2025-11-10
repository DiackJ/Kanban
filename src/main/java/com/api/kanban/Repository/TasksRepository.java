package com.api.kanban.Repository;

import com.api.kanban.Entity.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TasksRepository extends JpaRepository<Long, Tasks> {
}
