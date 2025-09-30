import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board';
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
  newBoardInputs: { [key: string]: { title: string; description: string } } = {};
  loading = false;

  statuses: string[] = ['TODO', 'IN_PROGRESS', 'DONE'];

  constructor(private boardService: BoardService) {
    this.statuses.forEach(s => this.newBoardInputs[s] = { title: '', description: '' });
  }

  ngOnInit(): void {
    this.fetchBoards();
  }

  fetchBoards() {
    this.loading = true;
    this.boardService.getBoards().subscribe({
      next: (data) => { this.boards = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  boardsByStatus(status: string): Board[] {
    return this.boards.filter(b => b.status === status);
  }

  addBoard(status: string) {
    const { title, description } = this.newBoardInputs[status];
    if (!title.trim()) return;

    const board: Partial<Board> = { title, description, status };

    this.boardService.createBoard(board).subscribe({
      next: (created) => {
        this.boards.push(created);
        this.newBoardInputs[status] = { title: '', description: '' };
      }
    });
  }

  deleteBoard(boardId: number) {
    this.boardService.deleteBoard(boardId).subscribe({
      next: () => this.boards = this.boards.filter(b => b.id !== boardId)
    });
  }

  // Handle drag & drop
  drop(event: CdkDragDrop<Board[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const board = event.previousContainer.data[event.previousIndex];
      board.status = newStatus;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Persist status update to backend
      this.boardService.updateBoard(board.id!, board).subscribe();
    }
  }
}
