import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackOfficeComponent } from "./backoffice/backoffice.component";
import { LoginComponent } from "./login/login.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BackOfficeComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
  
})
export class AppComponent {
  loggedin: boolean = false;
  getLoggedIn(loggedin: boolean){
    this.loggedin = loggedin;
  }
  title = 'frontend-g1';
}
