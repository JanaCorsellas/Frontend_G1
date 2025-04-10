import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { User } from '../models/user.model';

@Component({
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ColaboradoresComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalItems = 0;
  pages: number[] = [];
  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.users = response.users;
          this.filteredUsers = [...this.users];
          this.totalItems = response.totalUsers;
          this.totalPages = response.totalPages;
          this.generatePageNumbers();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.error = 'Error loading users. Please try again later.';
          this.loading = false;
        }
      });
  }

  generatePageNumbers(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = [...this.users];
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadUsers();
  }

  editUser(userId: string): void {
    console.log('Editar usuario con ID:', userId);
    // Implementación de la edición
  }

  deleteUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Estás seguro de que deseas eliminar este usuario?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Usar userId como string, no como número
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            console.log(`Usuario ${userId} eliminado correctamente`);
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
          }
        });
      }
    });
  }

  // Usar _id como string para el trackBy
  trackByUserId(index: number, user: User): string {
    return user._id;
  }
}