package com.collabboard.collab_backend.Repositories;

import com.collabboard.collab_backend.Models.Board;
import com.collabboard.collab_backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByOwner(User owner);
    List<Board> findByUsersContaining(User user);
}
