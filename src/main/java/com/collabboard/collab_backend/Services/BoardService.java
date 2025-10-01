package com.collabboard.collab_backend.Services;

import com.collabboard.collab_backend.Models.Board;
import com.collabboard.collab_backend.Models.User;
import com.collabboard.collab_backend.Repositories.BoardRepository;
import com.collabboard.collab_backend.Repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public BoardService(BoardRepository boardRepository, UserRepository userRepository) {
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
    }

    public Map<User, List<Board>> getBoardsByUsername(String usernameQuery) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(usernameQuery);
        Map<User, List<Board>> result = new HashMap<>();

        for (User user : users) {
            List<Board> ownedBoards = boardRepository.findByOwner(user);
            List<Board> sharedBoards = boardRepository.findByUsersContaining(user);

            Set<Board> allBoards = new HashSet<>();
            allBoards.addAll(ownedBoards);
            allBoards.addAll(sharedBoards);

            result.put(user, new ArrayList<>(allBoards));
        }

        return result;
    }
}
