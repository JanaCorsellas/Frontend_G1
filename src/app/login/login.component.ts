import { Component, EventEmitter, Output, OnInit } from '@angular/core'; // Importa OnInit
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit { 
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
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]] 
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

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

    const { email, password } = this.formLogin.value;
    console.log('Attempting login with credentials:', { email, password }); 
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loading = false;
        const user = response.user;
        if (user?.role === 'admin') { 
          this.router.navigate(['/admin']); 
        } else if (user?.role === 'user') {
          this.router.navigate(['/user-home']); 
        } else {
          this.error = 'Información de usuario incompleta o rol desconocido.';
             console.error('Login response missing user or role:', response);
             this.authService.logout();
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loading = false;
        this.error = error.error?.message || 'Error en el inicio de sesión';
      }
    });
  }

  loginWithGoogle(): void {
    this.authService.initGoogleAuth(); 
  }
}