import { Component, OnInit } from '@angular/core';
import { AchievementService } from '../../services/achievements/achievement.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AchievementFormComponent } from '../../components/achievement-form/achievement-form.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-backoffice-achievement',
  imports: [CommonModule, FormsModule, AchievementFormComponent],
  templateUrl: './backoffice-achievement.component.html',
  styleUrl: './backoffice-achievement.component.css'
})
export class AchievementComponent implements OnInit {
  
  achievements: any[] = [];
  totalAchievements = 0;
  filteredAchievements: any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  pageSizes: number[] = [6, 12, 24, 48];
  pages: number[] = [];
  loadedAchievements = false;
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedAchievement: any = null;
  selectedType: string = '';
  loading = false;
  error = '';
  
  constructor(
    private achievementService: AchievementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAchievements(1);
  }

  getAchievements(page: number): void {
    this.loading = true;
    this.loadedAchievements = false;
    
    this.achievementService.getAchievements(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Dades rebudes del servidor:', response);
          if (response.achievements.length > 0 && response.achievements) {
            this.achievements = response.achievements;
            this.totalAchievements = response.totalAchievements;
            this.totalPages = response.totalPages;
            this.filteredAchievements = [...this.achievements];
            
            this.generatePageNumbers();

          } else {
            console.warn("No s'han rebut reptes del servidor.");
          }
          
          this.filteredAchievements = [...this.achievements];
          this.generatePageNumbers();
          this.loading = false;
          this.loadedAchievements = true;
        },
        error: (err) => {
          console.error('Error al carregar reptes:', err);
          this.error = 'Error al carregar reptes';
          this.loading = false;

          this.generatePageNumbers();
          this.loadedAchievements = true;
        }
      });
  }

  changePageSize(event: Event) {
    // Es passa l'event i no el número directament perquè $event.target.value pot ser NULL
    const size = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.itemsPerPage = size;
    this.getAchievements(this.currentPage);
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
    this.getAchievements(page);
  }

  showCreateAchievementForm(): void {
    this.showCreateModal = true;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedAchievement = null;
  }

  updateAchievement(achievement: any): void {
    console.log('Editar achievement:', achievement);
    this.selectedAchievement = { ...achievement }; // Crear una còpia per no modificar l'original
    
    this.showEditModal = true;
    this.showCreateModal = false;
    this.showViewModal = false;
  }

  deleteAchievement(achievement: any): void {
    console.log('Eliminar achievement:', achievement);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Estàs segur de que vols eliminar l'achievement "${achievement.title}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.achievementService.deleteAchievement(achievement._id).subscribe({
          next: () => {
            console.log(`Achievement ${achievement._id} eliminat`);
            this.getAchievements(1);
          },
          error: (error) => {
            console.error("Error al eliminar l'achievement:", error);
          }
        });
      }
    });
  }

  getAchievementsDetails(achievement: any): void {
    console.log("Veure detalls de l'achievement:", achievement);
    
    // Si l'achievement té un ID vàlid, intentem carregar des del servidor els detalls
    if (achievement._id) {
      this.loading = true;
      
      // Primer guardem les dades bàsiques que ja tenim
      this.selectedAchievement = { ...achievement };

      this.showViewModal = true;
      
      // Després intentem obtenir dades més completes del servidor
      this.achievementService.getAchievementById(achievement._id).subscribe({
        next: (detailedAchievement) => {
          console.log("Dades completes de l'achievement:", detailedAchievement);
          
      // Crear una còpia per no perdre les dades que ja tenim
        const updatedAchievement = { ...this.selectedAchievement };
          
      // Actualitzar amb les noves dades
        Object.assign(updatedAchievement, detailedAchievement);
      // Actualizar l'estat amb les dades processades
        this.selectedAchievement = updatedAchievement;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error al carregar els detalls de l'achievement:", error);
       // Mantenim les dades que ja teniem
        this.loading = false;
      }
    });
  } else {
  // Si no hi ha ID, només mostrar les dades que ja tenim
      this.selectedAchievement = { ...achievement };
      this.showViewModal = true;
   }
  }
    
  onAchievementCreated(achievement: any): void {
      this.showCreateModal = false;
      this.showEditModal = false;
      if (achievement) {
        this.getAchievements(1); // Recargar la llista després de crear un nou achievement
      }
  }

  closeViewModal(): void {
      this.showViewModal = false;
      this.selectedAchievement = null;
      
      // Si s'han fet canis durant la visualització, actualitzar la llista
      if (this.loadedAchievements) {
        this.getAchievements(1);
      }
  }
   
  trackByAchievementId(index: number, achievement: any): string {
      return achievement._id;
  }
}