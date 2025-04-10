import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
export class AppComponent {
  loggedin: boolean = false;
  isAdmin: boolean = false;

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