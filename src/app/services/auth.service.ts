import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { tap, catchError } from 'rxjs/operators'; 
import { Router } from '@angular/router';

interface AuthResponse {
  token: string; 
  refreshToken?: string; 
  user: any; 
}

interface LoginData {
  email: string; 
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface RefreshTokenResponse {
  token: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl = 'http://localhost:3000/api/auth'; 
  public loginUrl = `${this.baseUrl}/login`;
  public registerUrl = `${this.baseUrl}/register`;
  public refreshTokenUrl = `${this.baseUrl}/refresh`;
  public logoutUrl = `${this.baseUrl}/logout`;
  public googleAuthUrl = `${this.baseUrl}/google`; 
  public getUserUrl = `${this.baseUrl}/user`;


  public isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasAccessToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  public currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(
    public http: HttpClient,
    public router: Router
  ) {
    if (this.hasAccessToken()) {
      this.isAuthenticatedSubject.next(true);
      this.loadUserData();
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  public hasAccessToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  public isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  public isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user && user.role === 'admin';
  }


  public login(credentials: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, credentials).pipe(
      tap(response => {
        this.setAccessToken(response.token);
        this.setCurrentUser(response.user); 
        this.isAuthenticatedSubject.next(true); 
      })
    );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.registerUrl, userData).pipe(
       tap(response => {
         this.setAccessToken(response.token); 
         this.setCurrentUser(response.user); 
         this.isAuthenticatedSubject.next(true);
       })
     );
   }

  initGoogleAuth(): void {
     window.location.href = this.googleAuthUrl;
   }

   handleGoogleCallback(token: string, refreshToken: string, userData?: any): void {
       this.setAccessToken(token); 
       this.setCurrentUser(userData); 
       this.isAuthenticatedSubject.next(true); 
       this.router.navigate(['/']);
   }

  refreshToken(): Observable<RefreshTokenResponse> {
    console.log('Intentando refrescar token...');
    return this.http.post<RefreshTokenResponse>(this.refreshTokenUrl, {}).pipe( 
      tap(response => {
        console.log('Token refrescado exitosamente.');
        this.setAccessToken(response.token); 
      }),
      catchError(error => {
         console.error('Error al refrescar token:', error);
         this.clearAuthData(); 
         return throwError(error); 
      })
    );
  }

  logout(): Observable<any> {
     console.log('Realizando logout...');
     return this.http.post(this.logoutUrl, {}).pipe( 
        tap(() => {
           console.log('Logout exitoso en backend.');
           this.clearAuthData(); 
           this.router.navigate(['/login']); 
        }),
        catchError(error => {
          console.error('Error durante la llamada de logout al backend:', error);
          this.clearAuthData();
          this.router.navigate(['/login']); 
          return of(null); 
        })
      );
   }

  getUserInfo(userId: string): Observable<any> {
      return this.http.get<any>(`${this.getUserUrl}/${userId}`);
  }


  private setAccessToken(token: string): void {
    localStorage.setItem('access_token', token); 
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setCurrentUser(user: any): void {
      if (user) {
          localStorage.setItem('user_data', JSON.stringify(user));
          this.currentUserSubject.next(user);
      } else {
          localStorage.removeItem('user_data');
          this.currentUserSubject.next(null);
      }
  }

  private loadUserData(): void {
     const storedUser = localStorage.getItem('user_data');
     if (storedUser) {
        try {
           const user = JSON.parse(storedUser);
           this.currentUserSubject.next(user);
        } catch (e) {
           console.error('Error al parsear user data desde localStorage', e);
           this.clearAuthData(); 
        }
     }
  }


   private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data'); 
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  checkLoginStatus(): void {
      if (this.hasAccessToken()) {
          this.isAuthenticatedSubject.next(true);
          this.loadUserData(); 
      } else {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
      }
   }

}
import { throwError } from 'rxjs';