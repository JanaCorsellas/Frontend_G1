import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://ea1-api.upc.edu/api/users';

  constructor(private http: HttpClient) { }

  // Obtenir usuaris paginats
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
}