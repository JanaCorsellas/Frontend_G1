import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl= 'http://localhost:3000/api/activities';
  constructor(private http: HttpClient) { }

  getActivities(page:number=1, limit: number=5): Observable<any>{
    const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
  
  return this.http.get<any>(this.apiUrl, { params });
}

  getActivitiesById(id:string): Observable<Activity>{
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  createActivity(activityData: any): Observable<any>{
    return this.http.post(this.apiUrl, activityData);
  }

  updateActivity(activityId: string,activityData: any ): Observable<any>{
    return this.http.put(`${this.apiUrl}/${activityId}`, activityId);
  }

  deleteActivity(activityId: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${activityId}`);
  }
}
