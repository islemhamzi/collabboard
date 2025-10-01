import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board';
import { UserService } from '../../services/user';
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-user-board',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, DragDropModule],
  templateUrl: './user-board.html',
  styleUrls: ['./user-board.scss']
})
export class UserBoardComponent implements OnInit {
  boards: Board[] = [];
  loading = false;
  usernameQuery: string = '';
  statuses: string[] = ['TODO', 'IN_PROGRESS', 'DONE'];
  dropListIds = this.statuses;
  newBoardInputs: { [key: string]: { title: string; description: string } } = {};
  darkMode: boolean = false;

  constructor(private boardService: BoardService) {
    this.statuses.forEach(status => {
      this.newBoardInputs[status] = { title: '', description: '' };
    });
  }

  ngOnInit(): void {
    // Optionally, fetch all boards on init
    // this.fetchBoards();
  }

  // === Search boards by username ===
  searchBoardsByUsername() {
    if (!this.usernameQuery.trim()) return;

    this.loading = true;
    this.boardService.getBoardsByUsername(this.usernameQuery).subscribe({
      next: (data) => {
        this.boards = data;
        this.loading = false;
      },
      error: () => {
        this.boards = [];
        this.loading = false;
      }
    });
  }

  boardsByStatus(status: string): Board[] {
    return this.boards.filter(board => board.status === status);
  }

  addBoard(status: string) {
    const input = this.newBoardInputs[status];
    if (!input.title.trim()) return;

    const board: Partial<Board> = {
      title: input.title,
      description: input.description,
      status: status
    };

    this.boardService.createBoard(board).subscribe({
      next: (created) => {
        this.boards.push(created);
        input.title = '';
        input.description = '';
      }
    });
  }

  deleteBoard(boardId: number) {
    this.boardService.deleteBoard(boardId).subscribe({
      next: () => {
        this.boards = this.boards.filter(b => b.id !== boardId);
      }
    });
  }

  drop(event: CdkDragDrop<Board[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const board = event.previousContainer.data[event.previousIndex];
      board.status = newStatus;

      this.boardService.updateBoard(board.id, board).subscribe({
        next: () => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        },
        error: (err) => console.error(err)
      });
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
  }
}
