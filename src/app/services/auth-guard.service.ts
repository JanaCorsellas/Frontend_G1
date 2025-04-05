import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AuthGuard: Verificando acceso a ruta', state.url);
    console.log('AuthGuard: Usuario autenticado?', this.authService.isLoggedIn());
    
    // Verificar si hay un usuario autenticado
    if (!this.authService.isLoggedIn()) {
      console.log('AuthGuard: No hay usuario autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }
    
    // Si la ruta requiere rol admin
    if (route.data['roleRequired'] === 'admin') {
      console.log('AuthGuard: Ruta requiere rol admin');
      console.log('AuthGuard: Usuario es admin?', this.authService.isAdmin());
      
      // Verificar si el usuario es admin
      if (!this.authService.isAdmin()) {
        console.log('AuthGuard: Usuario no es admin, redirigiendo a home');
        this.router.navigate(['/home']);
        return false;
      }
    }
    
    // Si todo está correcto, permitir acceso
    console.log('AuthGuard: Acceso permitido');
    return true;
  }
}