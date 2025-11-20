import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  
  @Input({ required: true }) task!: Task;
  @Output() taskUpdated = new EventEmitter<void>();

  private taskService = inject(TaskService);
  
  isDeleting: boolean = false;

  toggleStatus(newStatus: Task['status']): void {
    if (this.task.id === undefined) return;

    let updateObs: Observable<any>;
    
    if (newStatus === 'completada') {
        updateObs = this.taskService.completeTask(this.task.id);
    } else {
        updateObs = this.taskService.updateTask(this.task.id, { status: newStatus });
    }

    updateObs.subscribe({
      next: () => {
        this.taskUpdated.emit(); 
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
      }
    });
  }

  confirmDelete(): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${this.task.title}"?`)) {
      this.isDeleting = true;
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.taskUpdated.emit(); 
        },
        error: (err) => {
          console.error('Error al eliminar tarea:', err);
          this.isDeleting = false;
        }
      });
    }
  }

  getPriorityClass(): string {
    return `priority-${this.task.priority}`;
  }
  
  getStatusText(): string {
      const texts = {
          'pendiente': 'PENDIENTE',
          'en_progreso': 'EN PROGRESO',
          'completada': 'COMPLETADA'
      };
      return texts[this.task.status];
  }
}