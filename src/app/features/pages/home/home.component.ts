import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FeatureCardComponent } from '../../../components/feature-card/feature-card.component';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FeatureCardComponent,
    ActionButtonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}
  features = [
    {
      icon: 'water_drop',
      title: 'Gestión de Agua',
      description: 'Control completo de lecturas y consumo de agua potable rural'
    },
    {
      icon: 'group',
      title: 'Gestión de Usuarios',
      description: 'Administración de clientes, técnicos y funcionarios del sistema'
    },
    {
      icon: 'assessment',
      title: 'Reportes',
      description: 'Generación de informes detallados sobre consumo y gestión'
    },
    {
      icon: 'build',
      title: 'Mantenimiento',
      description: 'Seguimiento y programación de mantenimientos preventivos'
    }
  ];
  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
