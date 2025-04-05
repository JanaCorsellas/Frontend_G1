import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityHistoryService {
  private apiUrl = 'http://localhost:3000/api/activity-history';

  constructor(private http: HttpClient) { }

  // Obtener historial por ID de actividad
  getHistoryByActivityId(activityId: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<any>(`${this.apiUrl}/activity/${activityId}`, { params });
  }

  // Obtener todo el historial
  getAllHistory(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Buscar en el historial
  searchHistory(query: any, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.post<any>(`${this.apiUrl}/search`, { query }, { params });
  }

  // Eliminar un registro de historial
  deleteHistoryEntry(historyId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${historyId}`);
  }
}