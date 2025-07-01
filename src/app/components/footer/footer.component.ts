import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

/**
 * Componente Footer
 * @description Footer principal de la aplicación con información corporativa,
 * enlaces útiles y derechos de autor.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  /**
   * Navega a una URL externa
   * @param url URL de destino
   */
  navigateToExternal(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Abre el cliente de email predeterminado
   * @param email Dirección de email
   */
  openEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  /**
   * Abre el marcador telefónico
   * @param phone Número de teléfono
   */
  openPhone(phone: string): void {
    window.location.href = `tel:${phone}`;
  }
}
