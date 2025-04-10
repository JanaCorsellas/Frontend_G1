import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service'; 
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  userForm!: FormGroup; 
  submitted = false;
  loading = false;
  error = '';
  isAdmin = false;
  availableRoles: Array<'user' | 'admin'> = ['user', 'admin'];
  private componentSubscriptions = new Subscription();

  @Output() userCreated = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService 
  ) {
     this.userForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        bio: [''],
        profilePicture: [''],
        level: [1, [Validators.required, Validators.min(1)]],
        role: [{ value: 'user', disabled: true }, Validators.required]
     });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin(); 

    if (this.isAdmin) {
      this.userForm.get('role')?.enable();
    } else {
      this.userForm.get('role')?.disable();
    }
    this.userForm.get('role')?.setValue('user');
  }

  ngOnDestroy(): void {
    this.componentSubscriptions.unsubscribe();
  }

  get f() {
    return this.userForm.controls;
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control?.hasError(errorType) && (control?.touched || this.submitted));
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.userForm.invalid) {
       Object.values(this.userForm.controls).forEach(control => {
        control.markAsTouched();
       });
      return;
    }

    this.loading = true;
    const userData = this.userForm.getRawValue(); 

    const createSub = this.userService.createUser(userData).pipe(first()).subscribe({
      next: (response) => {
        this.loading = false;
        alert('Usuario creado con éxito!');
        this.userCreated.emit(true);
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al crear usuario: ' + (error.error?.message || error.message || 'Error desconocido.');
        console.error('Error al crear usuario:', error);
      }
    });
    this.componentSubscriptions.add(createSub);
  }

  resetForm() {
    this.submitted = false;
    this.error = '';
    this.userForm.reset({
      level: 1,
      role: 'user' 
    });
     if (!this.isAdmin) {
        this.userForm.get('role')?.disable();
     } else {
        this.userForm.get('role')?.enable();
     }
  }

  cancel() {
    this.resetForm();
    this.userCreated.emit(false);
  }
}