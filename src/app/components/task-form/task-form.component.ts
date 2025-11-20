import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  taskForm!: FormGroup;
  isEditMode: boolean = false;
  taskId: number | null = null;
  pageTitle: string = 'Crear Nueva Tarea';

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.taskId;

    this.initForm();

    if (this.isEditMode) {
      this.pageTitle = 'Editar Tarea';
      this.loadTask(this.taskId!);
    }
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['media', Validators.required],
      status: ['pendiente', Validators.required]
    });
  }

  loadTask(id: number) {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        const formattedDate = task.dueDate.split('T')[0];
        this.taskForm.patchValue({ ...task, dueDate: formattedDate });
      },
      error: (err) => {
        console.error('Error al cargar la tarea:', err);
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData: Partial<Task> = this.taskForm.value;

    if (this.isEditMode) {
      this.taskService.updateTask(this.taskId!, taskData).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => console.error('Error al actualizar tarea:', err)
      });
    } else {
      this.taskService.createTask(taskData as Task).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => console.error('Error al crear tarea:', err)
      });
    }
  }
}