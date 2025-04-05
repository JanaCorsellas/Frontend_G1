// src/app/components/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (data) => {
          this.users = data.users;
          this.totalItems = data.totalUsers;
          this.totalPages = data.totalPages;
          this.generatePageNumbers();
        },
        error: (error) => {
          console.error('Error carregant usuaris:', error);
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
    this.loadUsers();
  }

  editUser(userId: string): void {
    this.router.navigate(['/users/edit', userId]);
  }

  deleteUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Estàs segur de que vols eliminar aquest usuari?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error eliminant usuari:', error);
          }
        });
      }
    });
  }
}