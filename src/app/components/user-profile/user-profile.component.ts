import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  profileForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  success: string = '';
  editMode: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      profilePicture: ['']
    });
  }

  ngOnInit(): void {
    // Obtener el usuario actual del localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      console.log('No hay usuario autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return;
    }
    
    try {
      // Parsear el usuario almacenado en localStorage
      this.user = JSON.parse(storedUser);
      console.log('Usuario cargado del localStorage:', this.user);
      
      // Verificar que tengamos un ID válido
      if (!this.user.id) {
        console.error('ID de usuario no encontrado en localStorage');
        this.error = 'Error al obtener la información del usuario';
        return;
      }
      
      // Cargar los detalles del usuario desde el servidor
      this.loadUserDetails(this.user.id);
    } catch (error) {
      console.error('Error al parsear datos de usuario:', error);
      this.error = 'Error al procesar la información del usuario';
      this.router.navigate(['/login']);
    }
  }

  loadUserDetails(userId: string): void {
    this.loading = true;
    console.log('Cargando detalles del usuario con ID:', userId);
    
    // Usar el ID del usuario para cargar sus detalles completos
    this.userService.getUserById(userId).subscribe({
      next: (userData) => {
        console.log('Datos de usuario recibidos:', userData);
        this.user = userData;
        this.loading = false;
        
        // Actualizar el formulario con los datos del usuario
        this.profileForm.patchValue({
          username: userData.username || '',
          email: userData.email || '',
          bio: userData.bio || '',
          profilePicture: userData.profilePicture || ''
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al cargar los datos del usuario';
        console.error('Error al cargar datos del usuario:', error);
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    
    if (!this.editMode) {
      // Restablecer el formulario si se cancela la edición
      this.profileForm.patchValue({
        username: this.user.username || '',
        email: this.user.email || '',
        bio: this.user.bio || '',
        profilePicture: this.user.profilePicture || ''
      });
    }
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.profileForm.get(controlName);
    return !!control?.hasError(errorType) && control.touched;
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const updateData = {
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      bio: this.profileForm.value.bio,
      profilePicture: this.profileForm.value.profilePicture
    };

    this.userService.updateUser(this.user._id, updateData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Perfil actualizado correctamente';
        this.user = response.user;
        this.editMode = false;
        
        // Actualizar el usuario en el localStorage
        const updatedUser = {
          ...this.user,
          username: response.user.username,
          email: response.user.email,
          profilePicture: response.user.profilePicture
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error al actualizar el perfil';
        console.error('Error al actualizar el perfil:', error);
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/user-home']);
  }

  logout(): void {
    this.authService.logout();
    // La redirección al login se maneja en el servicio de autenticación
  }
}