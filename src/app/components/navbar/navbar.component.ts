import { Component, computed } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

/**
 * Componente de barra de navegación principal del sistema APR.
 * 
 * @description Este componente proporciona la navegación principal de la aplicación,
 * incluyendo el logo, menús de navegación, autenticación de usuarios y opciones específicas por rol.
 * Es responsive y se adapta automáticamente a dispositivos móviles.
 * 
 * @features
 * - Navegación responsive (desktop/mobile)
 * - Menús contextuales basados en roles de usuario
 * - Autenticación y logout
 * - Logo y branding de la aplicación
 * - Detección automática de tamaño de pantalla
 * 
 * @example
 * ```html
 * <app-navbar></app-navbar>
 * ```
 * 
 * @author Equipo de Desarrollo Mi APR
 * @since 1.0.0
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSidenavModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  isMobile = computed(() => {
    return this.breakpointObserver.isMatched('(max-width: 768px)');
  });
  publicNavItems = [
    { path: '/home', label: 'Inicio', icon: 'home' },
    { path: '/about', label: 'Nosotros', icon: 'info' },
    { path: '/contact', label: 'Contacto', icon: 'contact_mail' }
  ];
  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
  navigateToDashboard(): void {
    console.log('Dashboard button clicked');
    console.log('Current user:', this.currentUser());
    console.log('Is authenticated:', this.isAuthenticated());
    this.router.navigate(['/dashboard']);
  }
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
  navigateToReadings(): void {
    this.router.navigate(['/readings']);
  }
  navigateToUserManagement(): void {
    this.router.navigate(['/admin/users']);
  }
  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }
  logout(): void {
    this.authService.logout();
  }
  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'admin': 'Administrador',
      'funcionario': 'Funcionario',
      'tecnico': 'Técnico',
      'cliente': 'Cliente'
    };
    return roleNames[role] || role;
  }
}
export const navbar = NavbarComponent;
