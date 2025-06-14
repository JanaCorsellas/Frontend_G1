import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BackOfficeComponent } from './backoffice/backoffice.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component'; // Añadido UserProfileComponent

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
  ]
})
export class AppComponent implements OnInit {
  loggedin: boolean = false;
  isAdmin: boolean = false;
  title = `TAZER`;
  authMode: 'login' | 'register' = 'login';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects.startsWith('/register')) {
          this.authMode = 'register';
        } else if (event.urlAfterRedirects.startsWith('/login')) {
          this.authMode = 'login';
        }
      }
    });
  }

  // Método para manejar el evento exportLoggedIn
  getLoggedIn(loggedIn: boolean) {
    this.loggedin = loggedIn;

    if (loggedIn) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.isAdmin = currentUser?.role === 'admin';
    } else {
      this.isAdmin = false;
    }
  }
}