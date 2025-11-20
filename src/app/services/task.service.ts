import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service';

const API_BASE_URL = 'https://task-backend-m10u.onrender.com/api/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  getAllTasks(
    status: string = '',
    priority: string = '',
    search: string = ''
  ): Observable<Task[]> {
    const headers = this.createAuthHeaders();

    let params = new HttpParams();

    if (status) { params = params.set('status', status); }
    if (priority) { params = params.set('priority', priority); }
    if (search) { params = params.set('search', search); }

    return this.http.get<Task[]>(API_BASE_URL, { params, headers });
  }

  getTaskById(id: number): Observable<Task> {
    const headers = this.createAuthHeaders();
    return this.http.get<Task>(`${API_BASE_URL}/${id}`, { headers });
  }

  createTask(task: Omit<Task, 'id' | 'status'>): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(API_BASE_URL, task, { headers });
  }

  updateTask(id: number, task: Partial<Task>): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put<any>(`${API_BASE_URL}/${id}`, task, { headers });
  }

  deleteTask(id: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.delete<any>(`${API_BASE_URL}/${id}`, { headers });
  }

  completeTask(id: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.patch<any>(`${API_BASE_URL}/${id}/complete`, {}, { headers });
  }
}