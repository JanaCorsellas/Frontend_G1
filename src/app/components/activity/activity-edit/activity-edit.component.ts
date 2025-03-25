import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../../../services/activity/activity.service';
import { Activity } from '../../../models/activity.model';

@Component({
  selector: 'app-activity-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.css']
})
export class ActivityEditComponent implements OnInit {
  activityForm: FormGroup;
  activityId: string;
  loading = true;
  submitting = false;
  error = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.activityForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      duration: [0, [Validators.required, Validators.min(1)]],
      distance: [0, [Validators.required, Validators.min(0)]],
      elevationGain: [0, [Validators.required, Validators.min(0)]],
      averageSpeed: [0, [Validators.required, Validators.min(0)]],
      caloriesBurned: [null, [Validators.min(0)]],
      route: [[]],
      musicPlaylist: [[]]
    });
    
    // Obtener el ID de la actividad de los parámetros de ruta
    this.activityId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadActivity();
  }

  loadActivity(): void {
    if (!this.activityId) {
      this.error = 'No se ha proporcionado un ID de actividad válido';
      this.loading = false;
      return;
    }

    this.activityService.getActivitiesById(this.activityId).subscribe({
      next: (activity) => {
        // Formatear fechas para el input datetime-local
        const startTime = new Date(activity.startTime);
        const endTime = new Date(activity.endTime);
        
        const formatDateForInput = (date: Date) => {
          return date.toISOString().slice(0, 16); // Formato YYYY-MM-DDThh:mm
        };

        // Actualizar el formulario con los datos de la actividad
        this.activityForm.patchValue({
          name: activity.name,
          type: activity.type,
          startTime: formatDateForInput(startTime),
          endTime: formatDateForInput(endTime),
          duration: activity.duration,
          distance: activity.distance,
          elevationGain: activity.elevationGain,
          averageSpeed: activity.averageSpeed,
          caloriesBurned: activity.caloriesBurned || null,
          route: activity.route || [],
          musicPlaylist: activity.musicPlaylist || []
        });

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la actividad: ' + (err.message || 'Error desconocido');
        this.loading = false;
        console.error('Error cargando actividad:', err);
      }
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    return !!this.activityForm.get(controlName)?.hasError(errorType) &&
      (this.activityForm.get(controlName)?.touched || this.submitted);
  }
  onSubmit(): void {
    this.submitted = true;

    if (this.activityForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';

    // Convertir fechas de string a Date
    const formValues = { ...this.activityForm.value };
    formValues.startTime = new Date(formValues.startTime);
    formValues.endTime = new Date(formValues.endTime);

    this.activityService.updateActivity(this.activityId, formValues).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/activities']);
      },
      error: (err) => {
        this.error = 'Error al actualizar la actividad: ' + (err.message || 'Error desconocido');
        this.submitting = false;
        console.error('Error actualizando actividad:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/activities']);
  }
}