import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActivityService } from '../../services/activity/activity.service';
import { UserService } from '../../services/user.service';
import { Activity } from '../../models/activity.model';
import { ActivityCreateComponent } from '../../components/activity/activity-create/activity-create.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ActivityCreateComponent]
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  totalActivities = 0;
  pages: number[] = [];
  loading = false;
  error = '';
  showCreateModal = false;
  usernames: { [key: string]: string } = {}; // Caché de nombres de usuario por ID

  constructor(
    private activityService: ActivityService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading = true;
    this.error = '';
    
    this.activityService.getActivities(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.activities = response.activities;
        this.totalActivities = response.totalActivities;
        this.totalPages = response.totalPages;
        this.generatePageNumbers();
        
        // Carga nombres de usuario para cada actividad
        this.loadUsernames();
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar actividades: ' + (err.message || 'Error desconocido');
        this.loading = false;
        console.error('Error cargando actividades:', err);
      }
    });
  }

  loadUsernames(): void {
    // Obtener los IDs únicos de usuarios que son autores de las actividades
    const userIds = [...new Set(this.activities.map(activity => activity.author))];
    
    // Obtener los nombres de los usuario para cada ID
    userIds.forEach(userId => {
      if (!this.usernames[userId]) {
        this.userService.getUserById(userId).subscribe({
          next: (user) => {
            this.usernames[userId] = user.username;
          },
          error: (err) => {
            console.error(`Error obteniendo usuario ${userId}:`, err);
            this.usernames[userId] = 'Usuario desconocido';
          }
        });
      }
    });
  }

  getUsernameById(userId: string): string {
    return this.usernames[userId] || 'Cargando...';
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
    this.loadActivities();
  }

  showCreateActivityForm(): void {
    this.showCreateModal = true;
  }

  onActivityCreated(success: boolean): void {
    this.showCreateModal = false;
    if (success) {
      this.loadActivities();
    }
  }

  viewActivity(activityId: string): void {
    // Navegar a la página de detalles de la actividad
    this.router.navigate(['/activities', activityId]);
  }

  editActivity(activityId: string): void {
    // Navegar a la página de edición de la actividad
    this.router.navigate(['/activities/edit', activityId]);
  }

  deleteActivity(activityId: string): void {
    const activity = this.activities.find(a => a._id === activityId);
    if (!activity) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que deseas eliminar la actividad "${activity.name}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activityService.deleteActivity(activityId).subscribe({
          next: () => {
            // Recargar actividades
            this.loadActivities();
          },
          error: (err) => {
            this.error = 'Error al eliminar la actividad: ' + (err.message || 'Error desconocido');
            console.error('Error eliminando actividad:', err);
          }
        });
      }
    });
  }

  trackByActivityId(index: number, activity: Activity): string {
    return activity._id;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  }

  getActivityTypeName(type: string): string {
    const types: { [key: string]: string } = {
      'running': 'Running',
      'cycling': 'Ciclismo',
      'hiking': 'Senderismo',
      'walking': 'Caminata'
    };
    return types[type] || type;
  }

  getIconByType(type: string): string {
    const icons: { [key: string]: string } = {
      'running': 'directions_run',
      'cycling': 'directions_bike',
      'hiking': 'terrain',
      'walking': 'directions_walk'
    };
    return icons[type] || 'fitness_center';
  }
}