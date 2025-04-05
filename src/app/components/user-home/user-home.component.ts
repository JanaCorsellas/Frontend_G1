import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener el usuario actual del servicio de autenticación
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Verificar si hay usuario autenticado
    if (!this.user || !this.user.id) {
      console.log('No hay usuario autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('Usuario cargado en user-home:', this.user);
    
    // Si es admin, redirigir al panel de administración
    if (this.user.role === 'admin') {
      console.log('Usuario es admin, redirigiendo a panel admin');
      this.router.navigate(['/admin']);
    }
  }

  goToProfile(): void {
    // Registrar el intento de navegación para depuración
    console.log('Intentando navegar a /user-profile');
    
    // Navegación directa a la ruta correcta
    this.router.navigateByUrl('/user-profile').then(success => {
      console.log('Resultado de navegación:', success ? 'éxito' : 'fallo');
    }).catch(error => {
      console.error('Error en navegación:', error);
    });
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.authService.logout();
    
    // Asegurar redirección manual a login
    this.router.navigateByUrl('/login');
  }
}