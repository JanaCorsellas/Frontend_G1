import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  getActivityHistory() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://ea1-api.upc.edu/api/activities';

  constructor(private http: HttpClient) { }

  // Obtenir activitats paginades
  getActivities(page: number = 1, limit: number = 5): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtenir activitats d'un usuari específic
  getActivitiesByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  // Obtenir una activitat per ID
  getActivityById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  // Mètode per obtenir detalles d'actividad amb l'autor inclós
  getActivityWithAuthorDetails(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}?populate=author`;
    return this.http.get<any>(url);
  }
  
  // Crear una nova activitat
  createActivity(activityData: any): Observable<any> {
    return this.http.post(this.apiUrl, activityData);
  }

  // Actualitzar una activitat
  updateActivity(activityId: string, activityData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${activityId}`, activityData);
  }

  // Eliminar una activitat
  deleteActivity(activityId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${activityId}`);
  }
}