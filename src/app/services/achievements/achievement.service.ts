import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Achievement } from '../../models/achievement.model';


@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private apiUrl = 'http://localhost:8080/api/achievements';

  constructor(private http: HttpClient) { }
  
  // Crear un nou acjievement
  createAchievement(achievementData: any): Observable<any> {
    return this.http.post(this.apiUrl, achievementData);
  }
  
  // Obtenir achievements paginats
  getAchievements(page: number = 1, limit: number = 5, includeHidden: boolean = false): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtener un achievement per ID
  getAchievementById(id: string): Observable<Achievement> {
    return this.http.get<Achievement>(`${this.apiUrl}/${id}`);
  }

  // Actualitzar un achievement
  updateAchievement(achievementId: string, achievementData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${achievementId}`, achievementData);
  }
/*
  //Obtenir achievement per una condició
  getAchievementByCondition():Observable<any>{
    return this.http.get<Achievement>(`${this.apiUrl}/`)
    }

  //Obtenir tots els achievements d'un usuari
  getAchievementByUser():Observable<any>{

  }

  //Buscar achievements
  searchAchievements():Observable<any>{

  }
*/
  // Eliminar un achievement
  deleteAchievement(achievementId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${achievementId}`);
  }
}
