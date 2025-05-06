import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BackOfficeComponent } from './backoffice/backoffice.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthService } from './services/auth.service'; 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    LoginComponent,
    RegisterComponent,
    BackOfficeComponent,
    UserHomeComponent, 
    UserProfileComponent 
  ]
})
export class AppComponent implements OnInit {
  title = 'frontend-g1';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {
      this.authService.checkLoginStatus();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];
      const refreshToken = params['refreshToken'];

      if (token && refreshToken) {
        console.log('Tokens recibidos desde callback de Google');
        this.authService.handleGoogleCallback(token, refreshToken, null);
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {},
          replaceUrl: true
        });
      }
    });

    this.authService.isAuthenticated$.subscribe(isAuth => {
       console.log('Estado de autenticación:', isAuth);
     });
     this.authService.currentUser$.subscribe(user => {
        console.log('Usuario actual:', user);
     });
  }

  onLogout(): void {
    console.log('Intentando logout...');
    this.authService.logout().subscribe({
        next: () => {
            console.log('Logout completo.');
        },
        error: (err) => {
            console.error('Error durante logout:', err);
        }
    });
  }
}