import { Component, OnInit } from '@angular/core';
import { AchievementService } from '../../services/achievements/achievement.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AchievementFormComponent } from '../../components/achievement-create/achievement-form.component';
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
  paginatedAchievements: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
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

  allMockAchievements: any[] = [
    { 
      _id: '1', 
      title: 'Running en el parc', 
      description: 'asdsa', 
      condition: 'asdda',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png',
      usersUnlocked: '1234', 

    },
    { 
      _id: '1', 
      title: 'Running en el parc', 
      description: 'asdsa', 
      condition: 'asdda',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png',
      usersUnlocked: '1234', 

    },
    { 
      _id: '1', 
      title: 'Running en el parc', 
      description: 'asdsa', 
      condition: 'asdda',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png',
      usersUnlocked: '1234', 

    },
    { 
      _id: '1', 
      title: 'Running en el parc', 
      description: 'asdsa', 
      condition: 'asdda',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png',
      usersUnlocked: '1234', 

    },
    { 
      _id: '2', 
      title: 'Caminant per la platja', 
      description: 'asdasd', 
      condition: 'asdasd',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png',
      usersUnlocked: '1234', 

    },
    { 
      _id: '3', 
      title: 'Ciclisme a la muntanya', 
      description: 'asdasd', 
      condition: 'asdasd',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png',
      usersUnlocked: '1234', 

    },
  ];

  ngOnInit(): void {
    this.getAchievements();
  }

  getAchievements(): void {
    this.loading = true;
    this.loadedAchievements = false;
    
    this.achievementService.getAchievements(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Dades rebudes del servidor:', response);
          console.log('achievements rebuts:',response.achievement)
          
          if (Array.isArray(response)) {
            this.achievements = response;
            this.totalAchievements = response.length;
            this.totalPages = Math.ceil(this.totalAchievements / this.itemsPerPage);
            console.log(this.achievements);
          } else if (response && response.achievement) {
            this.achievements = response.achievement;
            this.totalAchievements = response.totalUsers || response.achievement.length;
            this.totalPages = response.totalPages || Math.ceil(this.totalAchievements / this.itemsPerPage);
          } else {
            console.warn("No s'han rebut achievements del servidor.");
            this.achievements = this.allMockAchievements.slice(0, this.itemsPerPage);
            this.totalAchievements = this.allMockAchievements.length;
            this.totalPages = Math.ceil(this.totalAchievements / this.itemsPerPage);
          }
          
          this.filteredAchievements = [...this.achievements];
          this.generatePageNumbers();
          this.updatePaginatedAchievements();
          this.loading = false;
          this.loadedAchievements = true;
        },
        error: (err) => {
          console.error('Error al carregar achievements:', err);
          this.error = 'Error al carregar achievements';
          this.loading = false;
          
          // En cas d'error, utilitzem les dades d'exemple
          this.achievements = this.allMockAchievements.slice(0, this.itemsPerPage);
          this.filteredAchievements = [...this.achievements];
          this.totalAchievements = this.allMockAchievements.length;
          this.totalPages = Math.ceil(this.totalAchievements / this.itemsPerPage);
          this.generatePageNumbers();
          this.updatePaginatedAchievements();
          this.loadedAchievements = true;
        }
      });
  }

  updatePaginatedAchievements(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAchievements = this.filteredAchievements.slice(startIndex, endIndex);
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
    this.updatePaginatedAchievements();
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
      data: { message: `Estàs segur de que vols eliminar l'achievement "${achievement.name}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.achievementService.deleteAchievement(achievement._id).subscribe({
          next: () => {
            console.log(`Achievement ${achievement._id} eliminat`);
            
            // Eliminar l'achievement de les dades de prova
            const index = this.allMockAchievements.findIndex(a => a._id === achievement._id);
            if (index !== -1) {
              this.allMockAchievements.splice(index, 1);
            }
            
            this.getAchievements();
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
        this.getAchievements(); // Recargar la llista després de crear un nou achievement
      }
  }

  closeViewModal(): void {
      this.showViewModal = false;
      this.selectedAchievement = null;
      
      // Si s'han fet canis durant la visualització, actualitzar la llista
      if (this.loadedAchievements) {
        this.getAchievements();
      }
  }
   
  trackByAchievementId(index: number, achievement: any): string {
      return achievement._id;
  }
}