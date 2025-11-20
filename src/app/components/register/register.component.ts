import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterData } from '../../models/task.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const userData: RegisterData = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    }

    this.authService.register(userData).subscribe({
      next: () => {
        alert("Registro exitoso. Por favor, inicia sesión.");
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'El registro falló.';
        console.error('Error de Registro:', err);
      }
    });
  }
}