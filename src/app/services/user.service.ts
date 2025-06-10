import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  // Obtenir usuaris paginats amb informació de seguiment
  getUsers(page: number = 1, limit: number = 5, includeHidden: boolean = false): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (includeHidden) {
      params = params.set('includeInvisible', 'false');
    }
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtener un usuari per ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  // Crear un nou usuari
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  // Actualitzar un usuari
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }

  // Eliminar un usuari
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
  
  // Canviar la visibilitat d'un usuari
  toggleUserVisibility(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/toggle-visibility`, {});
  }

  // ============ NOVES FUNCIONS PER GESTIÓ DE SEGUIDORS/SIGUIENDO ============

  // Fer seguir un usuari a un altre
  followUser(userId: string, targetUserId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/follow/${targetUserId}`, {});
  }

  // Fer que un usuari deixi de seguir a un altre
  unfollowUser(userId: string, targetUserId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/unfollow/${targetUserId}`, {});
  }

  // Verificar si un usuari segueix a un altre
  checkFollowStatus(userId: string, targetUserId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/follow-status/${targetUserId}`);
  }

  // Obtenir estadístiques de seguiment d'un usuari (seguidors i siguiendo)
  getUserFollowStats(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/follow-stats`);
  }

  // Obtenir usuaris sugerits per seguir
  getSuggestedUsers(userId: string, limit: number = 10): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/${userId}/suggested`, { params });
  }

  // Buscar usuaris per seguir
  searchUsersToFollow(userId: string, searchTerm: string, limit: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('search', searchTerm)
      .set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/${userId}/search-to-follow`, { params });
  }

  // Buscar usuaris per nom d'usuari (funcionalitat general)
  searchUsers(searchTerm: string): Observable<any> {
    let params = new HttpParams().set('search', searchTerm);
    return this.http.get(`${this.apiUrl}/search`, { params });
  }
}