import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivitiesComponent } from './backoffice-activity/backoffice-activity.component';
import { UsersComponent } from './backoffice-user/backoffice-user.component';
import { AuthService } from '../services/auth.service'; // Adjust the path as needed
import { AchievementComponent} from '../backoffice/backoffice-achievement/backoffice-achievement.component';
import { BackofficeSongComponent } from '../backoffice/backoffice-song/backoffice-song.component';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ActivitiesComponent, UsersComponent, AchievementComponent, BackofficeSongComponent ]
})
export class BackOfficeComponent implements OnInit {
  
  // Nova propietat per controlar la pestanya activa
  activeTab: string = 'users';

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
  
  ngOnInit(): void {
  }

  // Mètode per canviar entre pestanyes
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}