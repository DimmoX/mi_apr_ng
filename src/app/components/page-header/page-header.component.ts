import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})

/**
 * Componente de encabezado de página reutilizable
 *
 * Este componente muestra un título, subtítulo, icono y una ruta de navegación.
 * Permite personalizar el ancho máximo y la visibilidad del botón de retroceso.
 * El botón de retroceso emite un evento al hacer clic.
 */
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() breadcrumbPath: string = 'Dashboard';
  @Input() breadcrumbCurrent: string = '';
  @Input() showBackButton: boolean = true;
  @Input() backButtonTooltip: string = 'Volver al Dashboard';
  @Input() maxWidth: string = '1200px';
  @Output() backClick = new EventEmitter<void>();
  onBackClick(): void {
    this.backClick.emit();
  }
}
