// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(res => {
          localStorage.setItem(this.tokenKey, res.token);
          console.log('JWT stored:', res.token);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded JWT:', decoded);

      // Try multiple common keys
      if (decoded.roles && Array.isArray(decoded.roles)) {
        return decoded.roles;
      }
      if (decoded.authorities && Array.isArray(decoded.authorities)) {
        return decoded.authorities;
      }

      return [];
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return [];
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ROLE_ADMIN');
  }
}
