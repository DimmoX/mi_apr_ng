import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})

/**
 * Componente de diseño principal que define la estructura básica de la aplicación.
 * Incluye un encabezado de navegación y un pie de página.
 * Utiliza el enrutador de Angular para cargar componentes hijos en la vista principal.
 */
export class MainLayoutComponent {
}
