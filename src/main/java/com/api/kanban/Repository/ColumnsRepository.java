package com.api.kanban.Repository;

import com.api.kanban.Entity.Columns;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ColumnsRepository extends JpaRepository<Columns, Long> {
    Optional<Columns> findByStatusTitleIgnoreCase(String statusTitle);
}
