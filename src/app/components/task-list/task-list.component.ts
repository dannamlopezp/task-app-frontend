import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component'; 
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  
  private taskService = inject(TaskService);
  
  allTasks: Task[] = [];
  
  filterStatus: '' | 'pendiente' | 'en_progreso' | 'completada' = ''; 
  filterPriority: '' | 'baja' | 'media' | 'alta' = ''; 
  searchTerm: string = '';

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks(
        this.filterStatus,
        this.filterPriority,
        this.searchTerm
    ).subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
      },
      error: (err) => {
        console.error('Error cargando tareas:', err);
      }
    });
  }

  triggerFilterChange() {
      this.loadTasks();
  }
  
  onTaskUpdated() {
    this.loadTasks(); 
  }

  getTasksByStatus(status: Task['status']): Task[] {
    return this.allTasks.filter(task => task.status === status);
  }
}