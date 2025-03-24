import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]

})
export class ActivitiesComponent {

}
