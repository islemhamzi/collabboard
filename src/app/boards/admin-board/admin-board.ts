import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BoardService } from '../../services/board';
import { UserService } from '../../services/user';
import { Board } from '../../models/board.model';
import { User } from '../../models/user';


@Component({
  selector: 'app-admin-board',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-board.html',
  styleUrls: ['./admin-board.scss']
})
export class AdminBoardComponent implements OnInit {
searchUser() {
throw new Error('Method not implemented.');
}
  boards: Board[] = [];
  searchInput: string = '';
  selectedUser: User | null = null;
  userBoards: Board[] = [];
  activeTab: string = 'users'; // default tab

  constructor(
    private boardService: BoardService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchBoards();
  }

  // === All Boards Tab ===
  fetchBoards() {
    this.boardService.getBoards().subscribe({
      next: (data) => this.boards = data,
      error: (err) => console.error(err)
    });
  }

  deleteBoard(boardId: number) {
    this.boardService.deleteBoard(boardId).subscribe({
      next: () => this.boards = this.boards.filter(b => b.id !== boardId)
    });
  }

  createBoard(title: string, description: string) {
    if (!title.trim()) return;

    const board: Partial<Board> = { title, description };
    this.boardService.createBoard(board).subscribe({
      next: (created) => {
        this.boards.push(created);
      }
    });
  }

  // === Users Tab ===
  

  switchTab(tab: string) {
    this.activeTab = tab;
  }
}
