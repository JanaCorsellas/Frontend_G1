import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../../services/activity/activity.service';

@Component({
  selector: 'app-activity-create',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './activity-create.component.html',
  styleUrl: './activity-create.component.css'
})
export class ActivityCreateComponent implements OnInit{
  activityForm: FormGroup;
  submitted=false;
  loading=false;
  error= '';

  @Output() activityCreated = new EventEmitter<boolean>();
  
  constructor(
    private formBuilder: FormBuilder,
    private activityService:ActivityService
  ){
    this.activityForm=this.formBuilder.group({
      author: ['', [Validators.required]], 
      name: ['', [Validators.required, Validators.minLength(3)]], 
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      duration: [0, [Validators.required, Validators.min(1)]], 
      distance: [0, [Validators.required, Validators.min(0)]], 
      elevationGain: [0, [Validators.required, Validators.min(0)]],
      averageSpeed: [0, [Validators.required, Validators.min(0)]],
      type: ['', [Validators.required]], 
      caloriesBurned: [null, [Validators.min(0)]], // Opcional, pero mínimo 0
      route: [[]], // Lista de puntos GPS (opcional)
      musicPlaylist: [[]] // Lista de IDs de música (opcional)
    });
  }
  ngOnInit(): void {
    
  }
  get f() { 
    return this.activityForm.controls; 
  }

  hasError(controlName: string, errorType: string) {
    return this.activityForm.get(controlName)?.hasError(errorType) && 
           (this.activityForm.get(controlName)?.touched || this.submitted);
  }

  onSubmit() {
    this.submitted = true;

    if (this.activityForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.activityService.createActivity(this.activityForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.activityCreated.emit(true);
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'Error al crear la actividad. Por favor, inténtalo de nuevo.';
        console.error('Error al crear la actividad:', error);
      }
    });
  }

  resetForm() {
    this.submitted = false;
    this.activityForm.reset({
      level: 1
    });
  }

  cancel() {
    this.activityCreated.emit(false);
  }
  
}