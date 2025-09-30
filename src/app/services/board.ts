import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private baseUrl = 'http://localhost:8080/api/boards';

  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]> {
    const token = localStorage.getItem('token'); // your JWT token
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Board[]>(this.baseUrl, { headers });
  }

  createBoard(board: Partial<Board>): Observable<Board> {
    const token = localStorage.getItem('token'); // your JWT token
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<Board>(this.baseUrl, board,{headers});
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  updateBoard(id: number, board: Partial<Board>): Observable<Board> {
    return this.http.put<Board>(`${this.baseUrl}/${id}`, board);
  }
}
