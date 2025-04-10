import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  @Output() exportLoggedIn = new EventEmitter<boolean>();
  formLogin: FormGroup;
  loading: boolean = false;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.formLogin = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método para verificar si un control tiene un error específico
  hasError(controlName: string, errorType: string): boolean {
    const control = this.formLogin.get(controlName);
    return !!control?.hasError(errorType) && control.touched;
  }

  login() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials = this.formLogin.value;
    console.log('Attempting login with credentials:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loading = false;
        this.exportLoggedIn.emit(true);

        const user = response.user;
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user.role === 'user') {
          this.router.navigate(['/user-home']);
        } else {
          this.error = 'Rol desconocido. Contacte al administrador.';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loading = false;
        this.error = error.error?.message || 'Error en el inicio de sesión';
      }
    });
  }
}