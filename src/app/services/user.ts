import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users'; // ✅ adjust if needed

  constructor(private http: HttpClient) {}

  // Get user by email
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/email/${email}`);
  }

  // Get user by username
  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/username/${username}`);
  }

  // Get all boards for a user
  getBoardsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/boards`);
  }
}
