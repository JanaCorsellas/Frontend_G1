import { CommonModule } from '@angular/common';
import { Component, inject, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  authService = inject(AuthService);
  @Output() loggedin = new EventEmitter<string>();
  @Output() exportLoggedIn = new EventEmitter<boolean>();
  formLogin: FormGroup;
  loading: boolean = false;
  error: string = '';

  constructor(private form: FormBuilder){
    this.formLogin = this.form.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]], 
    });
  }
ngOnInit(): void {
    this.formLogin = this.form.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  hasError(controlName:string, errorType:string){
    return this.formLogin.get(controlName)?.hasError(errorType) && this.formLogin.get(controlName)?.touched;  
  }

  login(){
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
        console.log('Login exitoso:', response);
        this.exportLoggedIn.emit(true);
      
      },
      error: (error) => {
        console.error('Error en el login:', error);
        alert('Error en el login, verifica tus credenciales');
      }
    });
  }
}
