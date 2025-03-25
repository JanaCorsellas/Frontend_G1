import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UserCreateComponent } from '../components/user-create/user-create.component';
import { User } from '../models/user.model';
import { ActivitiesComponent } from './activities/activities.component';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UserCreateComponent, ActivitiesComponent]
})
export class BackOfficeComponent implements OnInit {
  // Control de vista activa
  activeView: 'users' | 'activities' = 'users';
  
  // Variables para la gestión de usuarios
  users: User[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  totalUsers = 0;
  pages: number[] = [];
  loading = false;
  error = '';
  usuariosListados = false;
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedUser: User | null = null;
  
  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
  }

  setActiveView(view: 'users' | 'activities'): void {
    this.activeView = view;
    
    // Si cambiamos a la vista de usuarios y ya estaban listados, no hacemos nada
    // Si no estaban listados, reiniciamos la vista
    if (view === 'users' && !this.usuariosListados) {
      this.resetUserView();
    }
  }

  // Reiniciar la vista de usuarios
  resetUserView(): void {
    this.usuariosListados = false;
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedUser = null;
  }

  obtenerUsuarios(): void {
    this.loading = true;
    
    // En un entorno real, llamarías al servicio con los parámetros de paginación:
    this.userService.getUsers(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          if (response.users && response.users.length > 0) {
            this.users = response.users.map((user: User) => ({
              ...user,
              visible: user.visible !== undefined ? user.visible : true // Inicializar visible a true si no está definido
            }));
            this.totalUsers = response.totalUsers;
            this.totalPages = response.totalPages;
          }
          this.generatePageNumbers();
          this.loading = false;
          this.usuariosListados = true;
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err);
          this.error = 'Error al cargar usuarios';
          this.loading = false;
          
          // En caso de error, simulamos paginación con datos de prueba
          this.generatePageNumbers();
          this.usuariosListados = true;
        }
      });
  }

 
  generatePageNumbers(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.obtenerUsuarios();
  }

  showCreateUserForm(): void {
    this.showCreateModal = true;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedUser = null;
  }

  editarUsuario(user: User): void {
    console.log('Editar usuario:', user);
    this.selectedUser = { ...user };
    this.showEditModal = true;
    this.showCreateModal = false;
    this.showViewModal = false;
  }

  marcarUsuarioInvisible(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que deseas ${user.visible ? 'ocultar' : 'mostrar'} el usuario ${user.username}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        user.visible = !user.visible;
        console.log(`Usuario ${user._id} ${user.visible ? 'visible' : 'ocultado'}`);
        // Aquí podríamos llamar a un servicio para actualizar el estado del usuario en el backend si es necesario
        // this.userService.updateUserVisibility(user._id, user.visible).subscribe();
      }
    });
  }

  eliminarUsuario(user: User): void {
    console.log('Eliminar usuario:', user);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que deseas eliminar el usuario ${user.username}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user._id).subscribe({
          next: () => {
            console.log(`Usuario ${user._id} eliminado`);
            
            
            this.obtenerUsuarios(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
          }
        });
      }
    });
  }

  verDetallesUsuario(user: User): void {
    console.log('Ver detalles de usuario:', user);
    this.selectedUser = { ...user }; // Crear una copia para no modificar el original
    this.showViewModal = true;
    this.showEditModal = false;
    this.showCreateModal = false;
  }

  onUserCreated(success: boolean): void {
    this.showCreateModal = false;
    if (success) {
      this.obtenerUsuarios(); 
    }
  }

  onUserEdited(success: boolean): void {
    if (success && this.selectedUser) {
      // Actualizar el usuario en el backend
      this.userService.updateUser(this.selectedUser._id, this.selectedUser).subscribe({
        next: () => {
          console.log(`Usuario ${this.selectedUser?._id} actualizado correctamente`);
          this.showEditModal = false;
          this.obtenerUsuarios(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
        }
      });
    } else {
      this.showEditModal = false;
    }
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedUser = null;
  }

  trackByUserId(index: number, user: User): string {
    return user._id;
  }
}