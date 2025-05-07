import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/songs/song.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SongFormComponent } from '../../components/song-form/song-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-backoffice-song',
  imports: [SongFormComponent, CommonModule, FormsModule],
  templateUrl: './backoffice-song.component.html',
  styleUrl: './backoffice-song.component.css'
})
export class BackofficeSongComponent implements OnInit {
  songs: any[] = [];
  totalSongs = 0;
  filteredSongs: any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
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
  pageSizes: number[] = [6, 12, 24, 48];
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

  ngOnInit(): void {
    this.getSongs(1);
  }

  getSongs(page: number): void {
    this.loading = true;
    this.loadedSongs = false;
    
    this.songsService.getSongs(page, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Dades rebudes del servidor:', response);
          if (response.songs.length > 0 && response.songs) {
            this.songs = response.songs;
            this.totalSongs = response.totalSongs || response.song.length;
            this.totalPages = response.totalPages || Math.ceil(this.totalSongs / this.itemsPerPage);
            this.filteredSongs = [...this.songs];
            
            this.generatePageNumbers();

            //Carreguem la llista de variables pels filtres de búsqueda
            this.titles = this.getFilterValues('title');
            this.artists = this.getFilterValues('artist');
            this.genres = this.getFilterValues('genre');
            this.albums = this.getFilterValues('album');
            this.resetSearchFilter();

          } else {
            console.warn("No s'han rebut cançons del servidor.");
          }

          this.loading = false;
          this.loadedSongs = true;
        },
        error: (err) => {
          console.error('Error al carregar les cançons:', err);
          this.error = 'Error al carregar cançons';
          this.loading = false;
          
          this.generatePageNumbers();

          //Carreguem la llista de variables pels filtres de búsqueda
          this.titles = this.getFilterValues('title');
          this.artists = this.getFilterValues('artist');
          this.genres = this.getFilterValues('genre');
          this.albums = this.getFilterValues('album');
          this.resetSearchFilter();
          
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
  }

  resetSearchFilter() {
    this.filter = {
      title: '',
      artist: '',
      album: '',
      genre: ''
    };
    this.filteredSongs = [...this.songs];
  }

  changePageSize(event: Event) {
    // Es passa l'event i no el número directament perquè $event.target.value pot ser NULL
    const size = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.itemsPerPage = size;
    this.getSongs(this.currentPage);
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
    this.getSongs(page);
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
            this.getSongs(1);
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
        this.getSongs(1); // Recargar la llista després de crear un nova cançó
      }
  }

  closeViewModal(): void {
      this.showViewModal = false;
      this.selectedSong = null;
      
      // Si s'han fet canvis durant la visualització, actualitzar la llista
      if (this.loadedSongs) {
        this.getSongs(1);
      }
  }

  trackBySongId(index: number, song: any): string {
    return song._id;
  }
}
