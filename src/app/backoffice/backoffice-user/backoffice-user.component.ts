import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivityService } from '../../services/activity.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { UserCreateComponent } from '../../components/user-create/user-create.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './backoffice-user.component.html',
  styleUrls: ['./backoffice-user.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UserCreateComponent]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  pageSizes: number[] = [6, 12, 24, 48];
  totalUsers = 0;
  pages: number[] = [];
  loading = false;
  error = '';
  loadedUsers = false;
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedUser: User | null = null;

  // ============ NOVES PROPIETATS PER GESTIÓ DE SEGUIDORS ============
  showFollowersModal = false;
  showFollowingModal = false;
  showFollowManagementModal = false;
  followers: any[] = [];
  following: any[] = [];
  followStats: any = null;
  followLoading = false;
  searchTerm = '';
  searchResults: any[] = [];
  selectedUserForFollow: User | null = null;
  
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.getUsers(1);
  }

  getUsers(page: number): void {
    this.loadedUsers = false;
    this.loading = true;
    
    // Obtenir tots els usuaris, incloent els ocults
    this.userService.getUsers(this.currentPage, this.itemsPerPage, true)
      .subscribe({
        next: (response) => {

          console.log('Resposta del servidor:', response);
          
          if (response.users && response.users.length > 0) {
            this.users = response.users.map((user: any) => ({
              ...user,
              // Utilitzar qualsevol de les dues propietats, prioritzant visibility (del backend)
              visible: user.visibility !== undefined ? user.visibility : (user.visible !== undefined ? user.visible : true),
              // Mapear las propiedades de seguimiento del backend
              followersCount: user.followersCount || (user.followers ? user.followers.length : 0),
              followingCount: user.followingCount || (user.following ? user.following.length : 0),
              followers: user.followers || [],
              following: user.following || []
            }));

            this.totalUsers = response.totalUsers;
            this.totalPages = response.totalPages;
            this.filteredUsers = [...this.users];

            this.generatePageNumbers();

          } else {
            console.warn("No s'han rebut usuaris del servidor.");
          }
          
          this.loading = false;
          this.loadedUsers = true;

        },
        error: (err) => {
          console.error('Error al carregar usuaris:', err);
          this.error = 'Error al carregar usuaris';
          this.loading = false;

          this.generatePageNumbers();
          this.loadedUsers = true;
        }
      });
  }

  changePageSize(event: Event) {
    // Es passa l'event i no el número directament perquè $event.target.value pot ser NULL
    const size = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.itemsPerPage = size;
    this.getUsers(this.currentPage);
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
    this.getUsers(page);
  }

  showCreateUserForm(): void {
    this.showCreateModal = true;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedUser = null;
  }

  updateUser(user: User): void {
    console.log('Editar usuari:', user);
    this.selectedUser = user; // Assignar directament per mantenir les propietats i mètodes de la classe User
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
            console.log(`Usuari ${user._id} ${response.user.visibility ? 'visible' : 'ocult'} correctament`);
            
            // Actualitzar la propietat visible/visibility en l'usuari local
            user.visible = response.user.visibility;
            user.visibility = response.user.visibility;
            
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al canviar visibilitat:', err);
            this.error = 'Error al canviar la visibilitat';
            this.loading = false;
          }
        });
      }
    });
  }

  viewUser(user: User): void {
    this.selectedUser = user;
    this.showViewModal = true;
    this.showEditModal = false;
    this.showCreateModal = false;
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Estàs segur de que vols eliminar l'usuari ${user.username}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        
        this.userService.deleteUser(user._id).subscribe({
          next: () => {
            console.log(`Usuari ${user._id} eliminat correctament`);
            this.getUsers(this.currentPage);
          },
          error: (err) => {
            console.error('Error al eliminar usuari:', err);
            this.error = 'Error al eliminar usuari';
            this.loading = false;
          }
        });
      }
    });
  }

  // ============ NOVES FUNCIONS PER GESTIÓ DE SEGUIDORS/SIGUIENDO ============

  // Obrir modal per veure seguidors
  viewFollowers(user: User): void {
    this.selectedUserForFollow = user;
    this.followLoading = true;
    this.showFollowersModal = true;
    
    this.userService.getUserFollowStats(user._id).subscribe({
      next: (response) => {
        this.followStats = response;
        this.followers = response.followers || [];
        this.followLoading = false;
      },
      error: (err) => {
        console.error('Error al carregar seguidors:', err);
        this.followLoading = false;
      }
    });
  }

  // Obrir modal per veure usuaris que segueix
  viewFollowing(user: User): void {
    this.selectedUserForFollow = user;
    this.followLoading = true;
    this.showFollowingModal = true;
    
    this.userService.getUserFollowStats(user._id).subscribe({
      next: (response) => {
        this.followStats = response;
        this.following = response.following || [];
        this.followLoading = false;
      },
      error: (err) => {
        console.error('Error al carregar usuaris seguits:', err);
        this.followLoading = false;
      }
    });
  }

  // Obrir modal per gestionar seguiment (buscar usuaris per seguir)
  manageFollowing(user: User): void {
    this.selectedUserForFollow = user;
    this.showFollowManagementModal = true;
    this.searchTerm = '';
    this.searchResults = [];
  }

  // Buscar usuaris per seguir
  searchUsersToFollow(): void {
    if (!this.searchTerm.trim() || this.searchTerm.length < 2) {
      this.searchResults = [];
      return;
    }

    if (!this.selectedUserForFollow) return;

    this.followLoading = true;
    this.userService.searchUsersToFollow(this.selectedUserForFollow._id, this.searchTerm).subscribe({
      next: (response) => {
        this.searchResults = response.users || [];
        this.followLoading = false;
      },
      error: (err) => {
        console.error('Error al buscar usuaris:', err);
        this.followLoading = false;
      }
    });
  }

  // Fer que un usuari segueixi a un altre
  followUser(targetUser: any): void {
    if (!this.selectedUserForFollow) return;

    this.followLoading = true;
    this.userService.followUser(this.selectedUserForFollow._id, targetUser._id).subscribe({
      next: (response) => {
        console.log('Usuari seguit correctament');
        // Marcar com seguit a la llista de resultats
        targetUser.isFollowing = true;
        this.followLoading = false;
      },
      error: (err) => {
        console.error('Error al seguir usuari:', err);
        this.followLoading = false;
      }
    });
  }

  // Fer que un usuari deixi de seguir a un altre
  unfollowUser(targetUser: any): void {
    if (!this.selectedUserForFollow) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Estàs segur de que vols que ${this.selectedUserForFollow.username} deixi de seguir a ${targetUser.username}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.followLoading = true;
        this.userService.unfollowUser(this.selectedUserForFollow!._id, targetUser._id).subscribe({
          next: (response) => {
            console.log('Usuari deixat de seguir correctament');
            // Actualitzar les llistes segons on estem
            if (this.showFollowingModal) {
              this.following = this.following.filter(u => u._id !== targetUser._id);
            }
            if (this.showFollowManagementModal) {
              targetUser.isFollowing = false;
            }
            this.followLoading = false;
          },
          error: (err) => {
            console.error('Error al deixar de seguir usuari:', err);
            this.followLoading = false;
          }
        });
      }
    });
  }

  // Tancar modals de seguiment
  closeFollowersModal(): void {
    this.showFollowersModal = false;
    this.followers = [];
    this.selectedUserForFollow = null;
  }

  closeFollowingModal(): void {
    this.showFollowingModal = false;
    this.following = [];
    this.selectedUserForFollow = null;
  }

  closeFollowManagementModal(): void {
    this.showFollowManagementModal = false;
    this.searchResults = [];
    this.searchTerm = '';
    this.selectedUserForFollow = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedUser = null;
  }

  // Track function per optimitzar el rendiment del *ngFor
  trackByUserId(index: number, user: any): any {
    return user._id;
  }

  // Gestionar l'event d'usuari creat
  onUserCreated(): void {
    this.closeCreateModal();
    this.getUsers(1); // Recarregar la primera pàgina
  }

  // Gestionar l'event d'usuari actualitzat
  onUserUpdated(): void {
    this.closeEditModal();
    this.getUsers(this.currentPage); // Recarregar la pàgina actual
  }
}