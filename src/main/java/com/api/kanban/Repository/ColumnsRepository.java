package com.api.kanban.Repository;

import com.api.kanban.Entity.Columns;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColumnsRepository extends JpaRepository<Long, Columns> {
}
