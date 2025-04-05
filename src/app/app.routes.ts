import { Routes } from '@angular/router';
import { BackOfficeComponent } from './backoffice/backoffice.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'admin', component: BackOfficeComponent },
  { path: 'user-home', component: UserHomeComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/edit/:id', component: UserEditComponent },
  { path: 'profile', redirectTo: '/user-profile', pathMatch: 'full' }, // Redirección por si alguien usa la ruta antigua
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección por defecto al login
  { path: '**', redirectTo: '/login' } // Redirección para rutas no encontradas
];