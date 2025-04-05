import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityHistory } from '../models/activity-history.model';
import { ActivityHistoryService } from '../services/activity-history.service';

@Component({
  selector: 'app-activity-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.css']
})
export class ActivityHistoryComponent implements OnInit {
  @Input() activityId?: string;
  
  histories: ActivityHistory[] = [];
  loading = false;
  error = '';
  
  // Paginación
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;
  selectedHistoryId: string | null = null;

  constructor(private activityHistoryService: ActivityHistoryService) { }
  
  ngOnInit(): void {
    if (this.activityId) {
      this.loadHistoryForActivity();
    } else {
      this.loadAllHistory();
    }
  }
  
  loadHistoryForActivity(): void {
    if (!this.activityId) return;
    
    this.loading = true;
    this.activityHistoryService.getHistoryByActivityId(this.activityId, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.histories = response.histories;
          this.totalItems = response.total;
          this.totalPages = response.pages;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el historial';
          this.loading = false;
          console.error('Error loading activity history:', err);
        }
      });
  }
  
  loadAllHistory(): void {
    this.loading = true;
    this.activityHistoryService.getAllHistory(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.histories = response.histories;
          this.totalItems = response.total;
          this.totalPages = response.pages;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el historial';
          this.loading = false;
          console.error('Error loading activity history:', err);
        }
      });
  }
  
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      if (this.activityId) {
        this.loadHistoryForActivity();
      } else {
        this.loadAllHistory();
      }
    }
  }

  toggleDetails(history: ActivityHistory): void {
    this.selectedHistoryId = this.selectedHistoryId === history._id ? null : history._id;
  }
  
  isSelected(history: ActivityHistory): boolean {
    return this.selectedHistoryId === history._id;
  }

  getChangeTypeLabel(changeType: string): string {
    switch (changeType) {
      case 'create': return 'Creación';
      case 'update': return 'Modificación';
      case 'delete': return 'Eliminación';
      default: return changeType;
    }
  }
  
  getUserName(history: ActivityHistory): string {
    if (history && history.userId) {
      // Si es un objeto con la propiedad username
      if (typeof history.userId === 'object' && history.userId.username) {
        return history.userId.username;
      }
      // Si es un string, mostrar el ID como fallback
      if (typeof history.userId === 'string') {
        return history.userId;
      }
    }
    return 'Usuario desconocido';
  }
  
  // Mejora en la representación de campos modificados
  getChangedFieldsText(history: ActivityHistory): string {
    if (!history.changedFields || history.changedFields.length === 0) {
      return '-';
    }
    
    // Traducción de nombres de campos para mejor visualización
    const fieldMap: {[key: string]: string} = {
      'name': 'Nombre',
      'startTime': 'Hora inicio',
      'endTime': 'Hora fin',
      'duration': 'Duración',
      'distance': 'Distancia',
      'elevationGain': 'Desnivel',
      'averageSpeed': 'Velocidad media',
      'caloriesBurned': 'Calorías',
      'type': 'Tipo',
      'route': 'Ruta',
      'musicPlaylist': 'Playlist',
      'author': 'Autor'
    };
    
    return history.changedFields
      .map(field => fieldMap[field] || field)
      .join(', '); 
  }
  
  // Formateador de fecha y hora consistente para mostrar en la UI
  formatDateTime(dateStr: string | Date): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  
  // Procesar valores para comparación más legible
  processValueForDisplay(key: string, value: any): any {
    // Si es una fecha, formatearla de manera consistente
    if ((key === 'startTime' || key === 'endTime') && value) {
      return this.formatDateTime(value);
    }
    
    // Para otros tipos de valores, retornar tal cual
    return value;
  }
  
  // Método para procesar el JSON para mostrar
  processJsonForDisplay(obj: any): any {
    if (!obj) return {};
    
    const result: any = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Procesar el valor según el tipo de campo
        result[key] = this.processValueForDisplay(key, obj[key]);
      }
    }
    
    return result;
  }
}