import { CommonModule } from '@angular/common';
import { Component, inject, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corregido (era styleUrl)
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  authService = inject(AuthService);
  @Output() loggedin = new EventEmitter<string>();
  @Output() exportLoggedIn = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) {
    this.formLogin = this.createForm();
  }

  ngOnInit(): void {
    // No es necesario volver a inicializar `formLogin`
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formLogin.get(controlName);
    return !!control?.hasError(errorType) && control.touched;
  }

  login(): void {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    const loginData = this.formLogin.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Inici de sessió satisfactori:', response);
        this.exportLoggedIn.emit(true);
      },
      error: (error) => {
        console.error("Error en l'inici de sessió:", error);
        alert("Error en l'inici de sessió, comprova les teves credencials.");
      }
    });
  }
}
