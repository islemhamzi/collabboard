    package com.collabboard.collab_backend.Controllers;

    import com.collabboard.collab_backend.Models.Board;
    import com.collabboard.collab_backend.Models.BoardStatus;
    import com.collabboard.collab_backend.Models.User;
    import com.collabboard.collab_backend.Repositories.BoardRepository;
    import com.collabboard.collab_backend.Repositories.UserRepository;
    import com.collabboard.collab_backend.Services.BoardService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    import java.security.Principal;
    import java.util.List;
    import java.util.Map;

    @RestController
    @RequestMapping("/api/boards")
    @RequiredArgsConstructor
    public class BoardController {

        private final BoardRepository boardRepository;
        private final UserRepository userRepository;
        private final BoardService boardService;



        // Get all boards accessible to the user
        @GetMapping
        public List<Board> getBoards(Principal principal) {
            User user = userRepository.findByUsername(principal.getName()).orElseThrow();
            if (user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"))) {
                return boardRepository.findAll();
            } else {
                return boardRepository.findByUsersContaining(user);
            }
        }
        @GetMapping("/by-user")
        public Map<User, List<Board>> getBoardsByUsername(@RequestParam String username) {
            return boardService.getBoardsByUsername(username);
        }

        // Create a new board
        @PostMapping
        public Board createBoard(@RequestBody Board board, Principal principal) {
            User owner = userRepository.findByUsername(principal.getName()).orElseThrow();
            board.setOwner(owner);
            board.getUsers().add(owner);
            if (board.getStatus()==null){
                board.setStatus(BoardStatus.TODO);// owner has access
            }
            return boardRepository.save(board);
        }

        // Delete a board (only admin or owner)
        @PreAuthorize("hasRole('ADMIN') or @boardSecurity.isOwner(#id, authentication.name)")
        @DeleteMapping("/{id}")
        public void deleteBoard(@PathVariable Long id) {
            boardRepository.deleteById(id);
        }
        @PreAuthorize("hasRole('ADMIN') or @boardSecurity.isOwner(#id, authentication.name)")
        @PutMapping("/{id}")
        public ResponseEntity<Board> updateBoard(@PathVariable Long id, @RequestBody Board updatedBoard) {
            return boardRepository.findById(id)
                    .map(board -> {
                        board.setTitle(updatedBoard.getTitle());
                        board.setDescription(updatedBoard.getDescription());
                        board.setStatus(updatedBoard.getStatus()); // 👈 important for drag/drop
                        Board saved = boardRepository.save(board);
                        return ResponseEntity.ok(saved);
                    })
                    .orElse(ResponseEntity.notFound().build());
        }

    }
