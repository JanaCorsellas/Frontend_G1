import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/songs/song.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SongFormComponent } from '../../components/song-form-component/song-form-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-backoffice-song',
  imports: [SongFormComponent,CommonModule,FormsModule],
  templateUrl: './backoffice-song.component.html',
  styleUrl: './backoffice-song.component.css'
})
export class BackofficeSongComponent implements OnInit {
  songs: any[] = [];
  totalSongs = 0;
  filteredSongs: any[] = [];
  paginatedSongs: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  pages: number[] = [];
  loadedSongs = false;
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedSong: any = null;
  selectedType: string = '';
  loading = false;
  error = '';
  titles: string[] = [];
  artists: string[] = [];
  albums: string[] = [];
  genres: string[] = [];
  filter = {
    title: '',
    artist: '',
    album: '',
    genre: ''
  };

  
  constructor(
    private songsService: SongService,
    private dialog: MatDialog
  ) {}

  allMockSongs: any[] = [
    {
      _id: '1', 
      title: 'Bohemian Rhapsody', 
      artist: 'Queen', 
      album: 'At night at the opera',
    },{
      _id: '2', 
      title: 'Stairway to Heaven', 
      artist: 'Led Zeppelin', 
      album: 'Led Zeppelin IV',
    },{
      _id: '3', 
      title: 'Hotel California', 
      artist: 'Eagles', 
      album: 'Hotel California',
    },{
      _id: '4', 
      title: 'Imagine', 
      artist: 'John Lennon', 
      album: 'Imagine',
    },{
      _id: '5', 
      title: 'Smells Like Teen Spirit', 
      artist: 'Nirvana', 
      album: 'Nevermind',
    }
  ]

  ngOnInit(): void {
    this.getSongs();
  }

  getSongs(): void {
    this.loading = true;
    this.loadedSongs = false;
    
    this.songsService.getSongs(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Dades rebudes del servidor:', response);
          
          if (Array.isArray(response)) {
            this.songs = response;
            this.totalSongs = response.length;
            this.totalPages = Math.ceil(this.totalSongs / this.itemsPerPage);
            console.log('Cançons rebudes:', this.songs);
          } else if (response && response.song) {
            this.songs = response.song;
            this.totalSongs = response.totalSongs || response.song.length;
            this.totalPages = response.totalPages || Math.ceil(this.totalSongs / this.itemsPerPage);
          } else {
            console.warn("No s'han rebut cançons del servidor.");
            this.songs = this.allMockSongs.slice(0, this.itemsPerPage);
            this.totalSongs = this.allMockSongs.length;
            this.totalPages = Math.ceil(this.totalSongs / this.itemsPerPage);
          }
          this.filteredSongs = [...this.songs];
          this.generatePageNumbers();
          this.updatePaginatedSongs();

          //Carreguem la llista de variables pels filtres de búsqueda
          this.titles = this.getFilterValues('title');
          this.artists = this.getFilterValues('artist');
          this.genres = this.getFilterValues('genre');
          this.albums = this.getFilterValues('album');

          this.loading = false;
          this.loadedSongs = true;
        },
        error: (err) => {
          console.error('Error al carregar les cançons:', err);
          this.error = 'Error al carregar cançons';
          this.loading = false;
          
          // En cas d'error, utilitzem les dades d'exemple
          this.songs = this.allMockSongs.slice(0, this.itemsPerPage);
          this.filteredSongs = [...this.songs];
          this.totalSongs = this.allMockSongs.length;
          this.totalPages = Math.ceil(this.totalSongs / this.itemsPerPage);
          this.generatePageNumbers();
          this.updatePaginatedSongs();
          this.loadedSongs = true;
        }
      });
  }

  getFilterValues(field: string): string[] {
    const set = new Set<string>();
    this.songs.forEach(song => {
    if (song[field]) {
        set.add(song[field]);
      }
    });
    return Array.from(set).sort();
  }

  applySearchFilter() {
    this.filteredSongs = this.songs.filter(song => {
      return (!this.filter.title || song.title === this.filter.title) &&
            (!this.filter.artist || song.artist === this.filter.artist) &&
            (!this.filter.album || song.album === this.filter.album) &&
            (!this.filter.genre || song.genre === this.filter.genre);
    });
    this.currentPage = 1;
    this.updatePaginatedSongs();
  }

  resetSearchFilter() {
    this.filter = {
      title: '',
      artist: '',
      album: '',
      genre: ''
    };
    this.filteredSongs = [...this.songs];
    this.currentPage = 1;
    this.updatePaginatedSongs();
  }

  updatePaginatedSongs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedSongs = this.filteredSongs.slice(startIndex, endIndex);
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
    this.updatePaginatedSongs();
  }

  showCreateSongForm(): void {
    this.showCreateModal = true;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedSong = null;
  }

  updateSong(song: any): void {
    console.log('Editar cançó:', song);
    this.selectedSong = { ...song }; // Crear una còpia per no modificar l'original
    
    this.showEditModal = true;
    this.showCreateModal = false;
    this.showViewModal = false;
  }

  deleteSong(song: any): void {
    console.log('Eliminar cançó:', song);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Estàs segur de que vols eliminar la cançó "${song.title}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.songsService.deleteSong(song._id).subscribe({
          next: () => {
            console.log(`Cançó ${song._id} eliminada`);
            
            // Eliminar la cançó de les dades de prova
            const index = this.allMockSongs.findIndex(a => a._id === song._id);
            if (index !== -1) {
              this.allMockSongs.splice(index, 1);
            }
            
            this.getSongs();
          },
          error: (error) => {
            console.error("Error al eliminar la cançó:", error);
          }
        });
      }
    });
  }

  getSongDetails(song: any): void {
    console.log("Veure detalls de la cançó:", song);
    
    // Si la cançó té un ID vàlid, intentem carregar des del servidor els detalls
    if (song._id) {
      this.loading = true;
      
      // Primer guardem les dades bàsiques que ja tenim
      this.selectedSong = { ...song };

      this.showViewModal = true;
      
      // Després intentem obtenir dades més completes del servidor
      this.songsService.getSongById(song._id).subscribe({
        next: (detailedSong) => {
          console.log("Dades completes de la canço:", detailedSong);
          
      // Crear una còpia per no perdre les dades que ja tenim
        const updatedSong = { ...this.selectedSong };
          
      // Actualitzar amb les noves dades
        Object.assign(updatedSong, detailedSong);
      // Actualizar l'estat amb les dades processades
        this.selectedSong = updatedSong;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error al carregar els detalls de la canço:", error);
        // Mantenim les dades que ja teniem
        this.loading = false;
      }
    });
  } else {
  // Si no hi ha ID, només mostrar les dades que ja tenim
      this.selectedSong = { ...song };
      this.showViewModal = true;
    }
  }
    
  onSongCreated(song: any): void {
      this.showCreateModal = false;
      this.showEditModal = false;
      if (song) {
        this.getSongs(); // Recargar la llista després de crear un nova cançó
      }
  }

  closeViewModal(): void {
      this.showViewModal = false;
      this.selectedSong = null;
      
      // Si s'han fet canvis durant la visualització, actualitzar la llista
      if (this.loadedSongs) {
        this.getSongs();
      }
  }

  trackBySongId(index: number, song: any): string {
    return song._id;
  }
}
