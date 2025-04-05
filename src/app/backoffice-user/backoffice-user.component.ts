import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivityService } from '../services/activity.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UserCreateComponent } from '../components/user-create/user-create.component';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './backoffice-user.component.html',
  styleUrls: ['./backoffice-user.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UserCreateComponent]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  totalUsers = 0;
  pages: number[] = [];
  loading = false;
  error = '';
  loadedUsers = false;
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedUser: User | null = null;
  
  // Dades d'exemple
  allMockUsers: User[] = [
    { _id: '1', username: 'Usuari1', email: 'usuari1@example.com', level: 1, bio: "Bio d'usuari 1", profilePicture: '', visible: true, visibility: true },
    { _id: '2', username: 'Usuari2', email: 'usuari2@example.com', level: 2, bio: "Bio d'usuari 2", profilePicture: '', visible: true, visibility: true },
    { _id: '3', username: 'Usuari3', email: 'usuari3@example.com', level: 3, bio: "Bio d'usuari 3", profilePicture: '', visible: false, visibility: false },
    { _id: '4', username: 'Usuari4', email: 'usuari4@example.com', level: 1, bio: "Bio d'usuari 4", profilePicture: '', visible: true, visibility: true },
    { _id: '5', username: 'Usuari5', email: 'usuari5@example.com', level: 2, bio: "Bio d'usuari 5", profilePicture: '', visible: false, visibility: false },
    { _id: '6', username: 'Usuari6', email: 'usuari6@example.com', level: 3, bio: "Bio d'usuari 1", profilePicture: '', visible: true, visibility: true },
  ];
  
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.loadedUsers = false;
    this.loading = true;
    
    // Obtenir tots els usuaris, incloent els ocults
    this.userService.getUsers(this.currentPage, this.itemsPerPage, true)
      .subscribe({
        next: (response) => {
          console.log('Resposta del servidor:', response);
          console.log('Usuaris rebuts:', response.users);
          
          if (response.users && response.users.length > 0) {
            this.users = response.users.map((user: User) => ({
              ...user,
              // Utilitzar qualsevol de les dues propietats, prioritzant visibility (del backend)
              visible: user.visibility !== undefined ? user.visibility : (user.visible !== undefined ? user.visible : true)
            }));
            console.log('Usuaris processats:', this.users);
            this.totalUsers = response.totalUsers;
            this.totalPages = response.totalPages;
          } else {
            console.log("No s'han trobat usuaris, utilitzant dades de simulació.");
            this.testPagination();
          }
          this.generatePageNumbers();
          this.loading = false;
          this.loadedUsers = true;
        },
        error: (err) => {
          console.error('Error al carregar usuaris:', err);
          this.error = 'Error al carregar usuaris';
          this.loading = false;
          
          // En cas d'error, treballem amb les dades de simulació
          //this.testPagination();
          this.generatePageNumbers();
          this.loadedUsers = true;
        }
      });
  }

  // Mètode per simular la paginació amb dades de prova
  testPagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.allMockUsers.length);
    
    // Obtenir els usuaris de la pàgina actual
    this.users = this.allMockUsers.slice(startIndex, endIndex).map(user => ({
      ...user,
      visible: user.visibility !== undefined ? user.visibility : (user.visible !== undefined ? user.visible : true)
    }));
    
    // Calcular el total d'usuaris i pàgines
    this.totalUsers = this.allMockUsers.length;
    this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
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
    this.getUsers();
  }

  showCreateUserForm(): void {
    this.showCreateModal = true;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedUser = null;
  }

  updateUser(user: User): void {
    console.log('Editar usuari:', user);
    this.selectedUser = { ...user }; // Crear una copia per no modificar l'original directament
    this.showEditModal = true;
    this.showCreateModal = false;
    this.showViewModal = false;
  }

  updateUserVisibility(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Estàs segur de que vols ${user.visible ? 'ocultar' : 'mostrar'} l'usuari ${user.username}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        
        // Cridem al servei per canviar la visibilitat en la base de dades
        this.userService.toggleUserVisibility(user._id).subscribe({
          next: (response) => {
            console.log(`Usuari ${user._id} ${response.user.visibility ? 'visible' : 'ocultat'}`);
            // Actualitzem les dues propietats per mantenir consistència
            user.visible = response.user.visibility;
            user.visibility = response.user.visibility;
            this.loading = false;
          },
          error: (error) => {
            console.error("Error al canviar la visibilitat de l'usuari:", error);
            this.error = "Error al canviar la visibilitat de l'usuari";
            this.loading = false;
          }
        });
      }
    });
  }

  deleteUser(user: User): void {
    console.log('Eliminar usuari:', user);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Estás segur de que vols eliminar l'usuari ${user.username}?` }
    });

    //Borrar les activitats associades a l'usuari
    if (user.activities) {
      user.activities.forEach(activityId => {
        this.activityService.deleteActivity(activityId).subscribe({
          next: () => {
            console.log(`Activitat ${activityId} eliminada`);
          },
          error: (error) => {
            console.error("Error al eliminar l'activitat:", error);
          }
        });
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user._id).subscribe({
          next: () => {
            console.log(`Usuari ${user._id} eliminat`);
            
            // Borrem l'usuari de la llista de prova
            const index = this.allMockUsers.findIndex(u => u._id === user._id);
            if (index !== -1) {
              this.allMockUsers.splice(index, 1);
            }
            
            this.getUsers();
          },
          error: (error) => {
            console.error("Error al eliminar l'usuari:", error);
          }
        });
      }
    });
  }

  getUserDetails(user: User): void {
    console.log("Veure detalls de l'usuari:", user);
    this.selectedUser = { ...user }; // Crear una copia per no modificar l'usuari
    // Obtenir els detalls de les activitats
    if (this.selectedUser.activities && this.selectedUser.activities.length > 0 && user.activities) {
      this.selectedUser.activities = []; // Inicialitzem l'array de les activitats
      user.activities.forEach(activityId => {
        this.activityService.getActivityById(activityId).subscribe({
          next: (activity) => {
            this.selectedUser?.activities?.push(activity); // Possem l'objecte d'activitat a l'array
          },
          error: (error) => {
            console.error(`Error obtenint l'activitat ${activityId}:`, error);
          }
        });
      });
    }
    this.showViewModal = true;
    this.showEditModal = false;
    this.showCreateModal = false;
  }


  onUserCreated(success: boolean): void {
    this.showCreateModal = false;
    if (success) {
      this.getUsers();
    }
  }

  onUserEdited(success: boolean): void {
    if (success && this.selectedUser) {
      // Actualitzar l'usuari en el backend
      this.userService.updateUser(this.selectedUser._id, this.selectedUser).subscribe({
        next: () => {
          console.log(`Usuari ${this.selectedUser?._id} actualitzat correctament.`);
          this.showEditModal = false;
          this.getUsers();
        },
        error: (error) => {
          console.error("Error al actualitzar l'usuari:", error);
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