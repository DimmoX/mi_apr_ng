import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Componente reutilizable para mostrar tarjetas de características/funcionalidades
 * 
 * Muestra información de una funcionalidad con icono, título y descripción.
 * Opcionalmente puede ser clickeable para navegación o acciones.
 * 
 * @example
 * ```html
 * <app-feature-card 
 *   icon="water_drop"
 *   title="Lecturas de Medidores"
 *   description="Gestiona las lecturas de consumo de agua"
 *   [clickable]="true"
 *   (clicked)="navigateToReadings()">
 * </app-feature-card>
 * ```
 */
@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss'
})
export class FeatureCardComponent {
  /** Icono de Material Icons a mostrar */
  @Input() icon: string = '';
  
  /** Título de la tarjeta */
  @Input() title: string = '';
  
  /** Descripción de la funcionalidad */
  @Input() description: string = '';
  
  /** Indica si la tarjeta es clickeable */
  @Input() clickable: boolean = false;
  
  /** Evento emitido cuando se hace click en la tarjeta */
  @Output() clicked = new EventEmitter<void>();

  /**
   * Maneja el evento de click en la tarjeta
   * Solo emite el evento si la tarjeta es clickeable
   */
  onClick(): void {
    if (this.clickable) {
      this.clicked.emit();
    }
  }
}
