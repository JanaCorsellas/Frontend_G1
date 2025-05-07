import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ActivityCreateComponent } from '../../components/activity-create/activity-create.component';
import { ActivityHistoryComponent } from '../../activity-history/activity-history.component';

@Component({
  selector: 'app-activities',
  templateUrl: './backoffice-activity.component.html',
  styleUrls: ['./backoffice-activity.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ActivityCreateComponent, ActivityHistoryComponent]
})
export class ActivitiesComponent implements OnInit {
  activities: any[] = [];
  filteredActivities: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  totalActivities = 0;
  pages: number[] = [];
  loading = false;
  error = '';
  loadedActivities = false;
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedActivity: any = null;
  selectedType: string = '';
  
  formattedStartTime: string = '';
  formattedEndTime: string = '';

  selectedActivityForHistory: string | null = null;
  showHistoryModal = false;
  
  openActivityHistory(activityId: string): void {
    console.log('Opening history for:', activityId); // For debugging
    this.selectedActivityForHistory = activityId;
    this.showHistoryModal = true;
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.selectedActivityForHistory = null;
  }
  // Dades d'exemple
  allMockActivities: any[] = [
    { 
      _id: '1', 
      name: 'Running en el parc', 
      author: '1', 
      authorName: 'Usuari1',
      startTime: new Date('2025-03-20T08:00:00'), 
      endTime: new Date('2025-03-20T09:00:00'), 
      duration: 60, 
      distance: 8000, 
      elevationGain: 50, 
      averageSpeed: 8, 
      caloriesBurned: 400, 
      type: 'running' 
    },
    { 
      _id: '2', 
      name: 'Ciclisme de muntanya', 
      author: '2', 
      authorName: 'Usuari2',
      startTime: new Date('2025-03-21T10:00:00'), 
      endTime: new Date('2025-03-21T12:00:00'), 
      duration: 120, 
      distance: 30000, 
      elevationGain: 500, 
      averageSpeed: 15, 
      caloriesBurned: 800, 
      type: 'cycling' 
    },
    { 
      _id: '3', 
      name: 'Caminata al llac', 
      author: '3', 
      authorName: 'Usuari3',
      startTime: new Date('2025-03-22T15:00:00'), 
      endTime: new Date('2025-03-22T17:00:00'), 
      duration: 120, 
      distance: 6000, 
      elevationGain: 120, 
      averageSpeed: 3, 
      caloriesBurned: 300, 
      type: 'hiking' 
    },
    { 
      _id: '4', 
      name: 'Carrera matutina', 
      author: '1', 
      authorName: 'Usuari1',
      startTime: new Date('2025-03-23T07:00:00'), 
      endTime: new Date('2025-03-23T07:45:00'), 
      duration: 45, 
      distance: 7500, 
      elevationGain: 30, 
      averageSpeed: 10, 
      caloriesBurned: 350, 
      type: 'running' 
    },
    { 
      _id: '5', 
      name: 'Passeig per la ciutat', 
      author: '2', 
      authorName: 'Usuari2',
      startTime: new Date('2025-03-24T18:00:00'), 
      endTime: new Date('2025-03-24T19:00:00'), 
      duration: 60, 
      distance: 4000, 
      elevationGain: 20, 
      averageSpeed: 4, 
      caloriesBurned: 200, 
      type: 'walking' 
    },
    { 
      _id: '6', 
      name: 'Ruta en bicicleta', 
      author: '3', 
      authorName: 'Usuari3',
      startTime: new Date('2025-03-25T09:00:00'), 
      endTime: new Date('2025-03-25T11:30:00'), 
      duration: 150, 
      distance: 40000, 
      elevationGain: 300, 
      averageSpeed: 16, 
      caloriesBurned: 1000, 
      type: 'cycling' 
    },
  ];
  
  constructor(
    private activityService: ActivityService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getActivities();
  }

  paginatedActivities: any[] = [];

  getActivities(): void {
    this.loading = true;
    this.loadedActivities = false;
    
    this.activityService.getActivities(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Dades rebudes del servidor:', response);
          
          if (Array.isArray(response)) {
            this.activities = response;
            this.totalActivities = response.length;
            this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
          } else if (response && response.activities) {
            this.activities = response.activities;
            this.totalActivities = response.totalUsers || response.activities.length;
            this.totalPages = response.totalPages || Math.ceil(this.totalActivities / this.itemsPerPage);
          } else {
            console.warn("No s'han rebut activitats del servidor.");
            this.activities = this.allMockActivities.slice(0, this.itemsPerPage);
            this.totalActivities = this.allMockActivities.length;
            this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
          }
          
          // Pre-processar les activitats per assegurar que el camp author sigui una cadena
          this.activities = this.activities.map(activity => {
            // Manejar els casos on l'autor pot venir com objeto o com un string
            if (activity.author && typeof activity.author === 'object' && activity.author._id) {
              // Si l'autor ve como un objeto, guardem l'ID com un string
              const authorId = activity.author._id;
              const authorName = activity.author.username || 'Desconegut';
              return { ...activity, author: authorId, authorName: authorName };
            }
            return activity;
          });
          
          // Ara carreguem els noms dels autors per als que només tenim l'ID
          this.loadAuthorNames();
          
          this.filteredActivities = [...this.activities];
          this.generatePageNumbers();
          this.updatePaginatedActivities();
          this.loading = false;
          this.loadedActivities = true;
        },
        error: (err) => {
          console.error('Error al carregar activitats:', err);
          this.error = 'Error al carregar activitats';
          this.loading = false;
          
          // En cas d'error, utilitzem les dades d'exemple
          this.activities = this.allMockActivities.slice(0, this.itemsPerPage);
          this.filteredActivities = [...this.activities];
          this.totalActivities = this.allMockActivities.length;
          this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
          this.generatePageNumbers();
          this.updatePaginatedActivities();
          this.loadedActivities = true;
        }
      });
  }

  loadAuthorNames(): void {
    // Crear un mapa para almacenar los autores por ID y evitar solicitudes duplicadas
    const userPromises: {[key: string]: Promise<any>} = {};
    
    this.activities.forEach(activity => {
      if (activity.author && typeof activity.author === 'string') {
        // Solo crear una promesa por cada ID de usuario único
        if (!userPromises[activity.author]) {
          userPromises[activity.author] = new Promise((resolve) => {
            this.userService.getUserById(activity.author as string).subscribe({
              next: (user) => resolve(user),
              error: () => resolve(null)
            });
          });
        }
        
        // Usar la promesa para asignar el nombre del autor
        userPromises[activity.author].then(user => {
          activity.authorName = user ? user.username : 'Desconegut';
        });
      } else {
        activity.authorName = 'Desconegut';
      }
    });
  }

  // Mètode per simular la paginació amb dades de proba
  testPagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.allMockActivities.length);
    
    this.activities = this.allMockActivities.slice(startIndex, endIndex);
    this.filteredActivities = [...this.activities];
    this.updatePaginatedActivities();
    
    this.totalActivities = this.allMockActivities.length;
    this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
  }

  updatePaginatedActivities(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedActivities = this.filteredActivities.slice(startIndex, endIndex);
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
    this.updatePaginatedActivities();
  }
  
  // Filtrar activitats per tipus
  filterActivities(): void {
    if (!this.selectedType) {
      this.filteredActivities = [...this.activities];
    } else {
      this.filteredActivities = this.activities.filter(activity => 
        activity.type === this.selectedType
      );
    }
    this.currentPage = 1;
    this.updatePaginatedActivities();
  }

  showCreateActivityForm(): void {
    this.showCreateModal = true;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedActivity = null;
  }

  updateActivity(activity: any): void {
    console.log('Editar activitat:', activity);
    this.selectedActivity = { ...activity }; // Crear una còpia per no modificar l'original
    
    this.formattedStartTime = this.formatDateTimeForInput(activity.startTime);
    this.formattedEndTime = this.formatDateTimeForInput(activity.endTime);
    
    this.showEditModal = true;
    this.showCreateModal = false;
    this.showViewModal = false;
  }

  deleteActivity(activity: any): void {
    console.log('Eliminar activitat:', activity);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Estàs segur de que vols eliminar l'activitat "${activity.name}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activityService.deleteActivity(activity._id).subscribe({
          next: () => {
            console.log(`Actividad ${activity._id} eliminada`);
            
            // Eliminar l'activitat de les dades de prova
            const index = this.allMockActivities.findIndex(a => a._id === activity._id);
            if (index !== -1) {
              this.allMockActivities.splice(index, 1);
            }
            
            this.getActivities();
          },
          error: (error) => {
            console.error("Error al eliminar l'activitat:", error);
          }
        });
      }
    });
  }

  getActivityDetails(activity: any): void {
    console.log("Veure detalls de l'activitat:", activity);
    
    // Si l'activitat té un ID vàlid, intentem carregar des del servidor els detalls
    if (activity._id) {
      this.loading = true;
      
      // Primer guardem les dades bàsiques que ja tenim
      this.selectedActivity = { ...activity };
      
      // Si ja tenim l'informació de l'autor en objecte, extreiem directament el nom de l'autor
      if (this.selectedActivity.author && typeof this.selectedActivity.author === 'object') {
        if (this.selectedActivity.author.username) {
          this.selectedActivity.authorName = this.selectedActivity.author.username;
        }
      }
      
      this.showViewModal = true;
      
      // Després intentem obtenir dades més completes del servidor
      this.activityService.getActivityById(activity._id).subscribe({
        next: (detailedActivity) => {
          console.log("Dades completes de l'activitat:", detailedActivity);
          
          // Crear una còpia per no perdre les dades que ja tenim
          const updatedActivity = { ...this.selectedActivity };
          
          // Actualitzar amb les noves dades mantenint el nom de l'autor si ja el tenim
          Object.assign(updatedActivity, detailedActivity);
          
          // Manejar específicament el camp author que pot ser un objecte o un string
          if (detailedActivity.author) {
            if (typeof detailedActivity.author === 'object') {
              // Si l'autor és un objecte, extreiem el seu nom d'usuari
              if (detailedActivity.author.username) {
                updatedActivity.authorName = detailedActivity.author.username;
              }
              // Guardem la referència a l'autor
              updatedActivity.authorId = detailedActivity.author._id;
            } else if (typeof detailedActivity.author === 'string') {
              // Si és un string, carreguem l'usuari associat a l'ID
              updatedActivity.authorId = detailedActivity.author;
              
              this.userService.getUserById(detailedActivity.author).subscribe({
                next: (user) => {
                  if (user && user.username) {
                    updatedActivity.authorName = user.username;
                    this.selectedActivity = updatedActivity;
                  }
                },
                error: () => {
                  // Mantenir el que ja teniem
                }
              });
            }
          }
          
          // Actualizar l'estat amb les dades processades
          this.selectedActivity = updatedActivity;
          this.loading = false;
        },
        error: (error) => {
          console.error("Error al carregar els detalls de l'activitat:", error);
          // Mantenem les dades que ja teniem
          this.loading = false;
        }
      });
    } else {
      // Si no hi ha ID, només mostrar les dades que ja tenim
      this.selectedActivity = { ...activity };
      // Processar el autor si és un objecte
      if (this.selectedActivity.author && typeof this.selectedActivity.author === 'object') {
        if (this.selectedActivity.author.username) {
          this.selectedActivity.authorName = this.selectedActivity.author.username;
        }
      }
      this.showViewModal = true;
    }
  }

  onActivityCreated(success: boolean): void {
    this.showCreateModal = false;
    if (success) {
      this.getActivities(); // Recargar la llista després de crear una nova activitat
    }
  }
  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedActivity = null;
    
    // Si s'han fet canis durant la visualització, actualitzar la llista
    if (this.loadedActivities) {
      this.getActivities();
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    } else {
      return `${mins}min`;
    }
  }

 
  trackByActivityId(index: number, activity: any): string {
    return activity._id;
  }
  formatDateTimeForInput(dateStr: string | Date): string {
    if (!dateStr) return '';
    
    // Convertir a objeto Date si es string
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    
    // Obtener año, mes, día, hora y minutos
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() devuelve 0-11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Formato YYYY-MM-DDThh:mm (compatible con input datetime-local)
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  // Cuando se procesa la edición, modifica la función onActivityEdited de esta manera:
  onActivityEdited(success: boolean): void {
    if (success && this.selectedActivity) {
      // Preparar el objeto para actualización, creando nuevas instancias de Date
      // para startTime y endTime a partir de los campos formateados
      const updateData = {
        ...this.selectedActivity,
        startTime: this.formattedStartTime ? new Date(this.formattedStartTime) : this.selectedActivity.startTime,
        endTime: this.formattedEndTime ? new Date(this.formattedEndTime) : this.selectedActivity.endTime,
      };
      
      // Actualizar la actividad en la base de datos
      this.activityService.updateActivity(this.selectedActivity._id, updateData).subscribe({
        next: (updatedActivity) => {
          console.log(`Actividad ${this.selectedActivity?._id} actualizada correctamente`, updatedActivity);
          this.showEditModal = false;
          this.getActivities();
        },
        error: (error) => {
          console.error("Error al actualizar la actividad:", error);
        }
      });
    } else {
      this.showEditModal = false;
    }
  }
}