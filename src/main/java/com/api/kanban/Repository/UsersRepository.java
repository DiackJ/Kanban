package com.api.kanban.Repository;

import com.api.kanban.Entity.Boards;
import com.api.kanban.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsersRepository extends JpaRepository<Users, UUID> {
    Optional<Users> findByEmail(String email);
    List<Boards> findBoardsById(UUID id);
}
