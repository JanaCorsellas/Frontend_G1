import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service'; 
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Añadir el access token a Authorization
    request = this.addToken(request, this.authService.getAccessToken());

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Error 401 recibido. Refrescar token.
        return this.handle401Error(request, next);
      } else {
        // Otros errores
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string | null): HttpRequest<any> {
      if (token) {
          // Si tenemos un token, lo añadimos a la cabecera Authorization como Bearer
          return request.clone({
              setHeaders: {
                  Authorization: `Bearer ${token}`
              }
          });
      }
      // Si no hay token, la petición se envía sin la cabecera Authorization
      return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); 
      // Llamar al método refreshToken del AuthService
      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          // Almacenar el nuevo access token recibido

          // Notificar a las peticiones en cola con el nuevo token
          this.refreshTokenSubject.next(response.token);

          // Reintentar la petición original con el nuevo token
          return next.handle(this.addToken(request, response.token));
        }),
        catchError((error) => {
          // Si el refresh falla, limpiar sesión y redirigir
          this.isRefreshing = false;
          this.authService['clearAuthData'](); // Acceder al método privado usando notación de corchetes
          this.router.navigate(['/login']); // Redirigir al login
          return throwError(error); // Re-lanzar el error original o del refresh
        })
      );
    } else {
      //Reintentar la petición original con el nuevo token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null), // Esperar hasta que haya un nuevo token
        take(1), // Tomar solo el el nuevo token
        switchMap(token => {
          // Reintentar la petición original con el nuevo token
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }
}