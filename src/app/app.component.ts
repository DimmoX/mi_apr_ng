import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente raíz de la aplicación Mi APR
 * 
 * Este es el componente principal que actúa como contenedor
 * para toda la aplicación de gestión de sistemas APR.
 * 
 * @example
 * ```html
 * <app-root></app-root>
 * ```
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  /** Título de la aplicación */
  title = 'mi-apr-ng';
}
