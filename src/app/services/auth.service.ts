import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { RegisterData } from '../models/task.model';

const API_BASE_URL = 'https://task-backend-m10u.onrender.com/api/auth'; 

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/login`, { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        console.log('Token almacenado:', response.token);
        console.log('Token desde getToken():', this.getToken());
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(userData: RegisterData): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }
}