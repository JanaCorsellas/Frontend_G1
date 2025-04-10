import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service'; 
import { User } from '../../models/user.model'; 
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class UserEditComponent implements OnInit, OnDestroy {
  userForm!: FormGroup; 
  userId: string;
  loading = false;
  submitted = false;
  error = '';
  isAdmin = false;
  availableRoles: Array<'user' | 'admin'> = ['user', 'admin'];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
     this.userForm = this.formBuilder.group({
       username: ['', Validators.required],
       email: ['', [Validators.required, Validators.email]],
       bio: [''],
       profilePicture: [''],
       level: [1, [Validators.required, Validators.min(1)]],
       role: [{ value: 'user', disabled: true }, Validators.required]
     });
     this.userId = this.route.snapshot.params['id'];
     if (!this.userId) {
        console.error("Error: No se encontró ID de usuario en la ruta.");
     }
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin(); 

    if (this.isAdmin) {
      this.userForm.get('role')?.enable();
    } else {
      this.userForm.get('role')?.disable();
    }

    if (this.userId) {
        this.loadUserData();
    } else {
        this.error = "ID de usuario no encontrado en la ruta.";
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUserData(): void {
    this.loading = true;
    this.error = '';
    const loadSubscription = this.userService.getUserById(this.userId)
      .pipe(first())
      .subscribe({
        next: (user: User) => {
          this.loading = false;
          this.userForm.patchValue({
            username: user.username,
            email: user.email,
            bio: user.bio || '',
            profilePicture: user.profilePicture || '',
            level: user.level,
            role: user.role 
          });
           if (!this.isAdmin) {
            this.userForm.get('role')?.disable();
           } else {
            this.userForm.get('role')?.enable();
           }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Error al cargar datos del usuario: ' + (error.error?.message || error.message || 'Error desconocido');
          console.error('Error loading user:', error);
        }
      });
    this.subscriptions.add(loadSubscription);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.userForm.invalid) {
       Object.values(this.userForm.controls).forEach(control => {
        control.markAsTouched();
       });
      return;
    }

    this.loading = true;
    const formData = this.userForm.getRawValue();
    const updatePayload: any = {
      username: formData.username,
      email: formData.email,
      bio: formData.bio,
      profilePicture: formData.profilePicture,
      level: formData.level
    };

    if (this.isAdmin) {
      updatePayload.role = formData.role;
    }

    const updateSubscription = this.userService.updateUser(this.userId, updatePayload)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loading = false;
          alert('Usuario actualizado correctamente!');
          this.router.navigate(['/admin/users']); 
        },
        error: (error: any) => {
          this.loading = false;
          this.error = 'Error al actualizar usuario: ' + (error.error?.message || error.message || 'Error desconocido');
          console.error('Error updating user:', error);
        }
      });
    this.subscriptions.add(updateSubscription);
  }

  get f() {
    return this.userForm.controls;
  }
}