import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:8080/api/";
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router // Añadimos el Router para poder redirigir
  ) {
    this.checkLoginStatus();
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user && user.role === 'admin';
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl + "users/login", credentials).pipe(
      tap((response: any) => {
        if (response && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    // Añadimos redirección al login
    this.router.navigate(['/login']);
  }
  
  register(registerData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}users/register`, registerData);
  }
  
  checkLoginStatus(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
    } else {
      this.currentUserSubject.next(null);
    }
  }
}