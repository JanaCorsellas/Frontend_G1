import { CommonModule } from '@angular/common';
import { Component, inject, EventEmitter, Output, OnInit } from '@angular/core'; 
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent implements OnInit { 

  formRegister: FormGroup;
  authService = inject(AuthService); 
  @Output() exportRegistered = new EventEmitter<boolean>(); 
  error: string = ''; 
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router){ 
    this.formRegister = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

  ngOnInit(): void {
     if (this.authService.isAuthenticated()) {
        this.router.navigate(['/']);
     }
  }

  hasError(controlName:string, errorType:string){
    return !!this.formRegister.get(controlName)?.hasError(errorType) && !!this.formRegister.get(controlName)?.touched; 
  }

  register(){
    this.error = ''; 
    this.loading = true; 


    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      this.loading = false; 
      return;
    }

    const registerData = this.formRegister.value;

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registre amb èxit:', response);
        this.loading = false; 
        const user = response.user;
        if (user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user?.role === 'user') {
          this.router.navigate(['/user-home']);
        } else {
            this.error = 'Información de usuario incompleta o rol desconocido después del registro.';
             console.error('Register response missing user or role:', response);
             this.authService.logout(); 
        }

      },
      error: (error) => {
        console.error('Error en el registre:', error);
        this.loading = false; 
        this.error = error.error?.message || 'Error en el registre, prova-ho de nou més tard.';
      }
    });
  }
}