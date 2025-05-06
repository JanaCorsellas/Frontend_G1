// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { BackOfficeComponent } from './backoffice/backoffice.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] }, 
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] }, 
  { path: 'admin', component: BackOfficeComponent, canActivate: [AuthGuard] },
  { path: 'user-home', component: UserHomeComponent, canActivate: [AuthGuard] }, 
  { path: '', redirectTo: '/users', pathMatch: 'full' },
   { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }