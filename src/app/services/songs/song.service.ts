import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Song} from '../../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
private apiUrl = 'http://ea1-api.upc.edu/api/songs';

  constructor(private http: HttpClient) { }
  
  // Crear una nova cançó
  createSong(songData: any): Observable<any> {
    return this.http.post(this.apiUrl, songData);
  }
  
  // Obtenir cançons
  getSongs(page: number, limit: number, includeHidden: boolean = false): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtener una canço per ID
  getSongById(id: string): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/${id}`);
  }

  // Actualitzar una cançó
  updateSong(songId: string, songData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${songId}`, songData);
  }

  // Eliminar una cançó
  deleteSong(songId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${songId}`);
  }
}
