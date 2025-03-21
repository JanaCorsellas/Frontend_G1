import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  // Obtener usuarios paginados
  getUsers(page: number = 1, limit: number = 5, includeHidden: boolean = false): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (includeHidden) {
      params = params.set('includeInvisible', 'true');
    }
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtener un usuario por ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  // Crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  // Actualizar un usuario existente
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }

  // Eliminar un usuario
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
  
  // Cambiar visibilidad de un usuario
  toggleUserVisibility(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/toggle-visibility`, {});
  }
}