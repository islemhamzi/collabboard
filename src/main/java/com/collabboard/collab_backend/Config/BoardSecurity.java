package com.collabboard.collab_backend.Config;



import com.collabboard.collab_backend.Repositories.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("boardSecurity")
@RequiredArgsConstructor
public class BoardSecurity {

    private final BoardRepository boardRepository;

    public boolean isOwner(Long boardId, String username) {
        return boardRepository.findById(boardId)
                .map(board -> board.getOwner().getUsername().equals(username))
                .orElse(false);
    }
}
