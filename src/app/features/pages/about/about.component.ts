import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})

/**
 * Componente que muestra información sobre la aplicación.
 * Incluye detalles sobre el equipo de desarrollo, tecnologías utilizadas y enlaces a redes sociales.
 * Utiliza iconos de Angular Material para mejorar la presentación visual.
 */
export class AboutComponent {
}
