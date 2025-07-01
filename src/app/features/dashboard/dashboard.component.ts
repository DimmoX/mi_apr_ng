import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';

/**
 * Componente del panel principal (dashboard) del sistema Mi APR
 * 
 * Muestra información personalizada según el rol del usuario autenticado
 * y proporciona acceso rápido a las funcionalidades principales del sistema.
 * 
 * @example
 * ```typescript
 * // Uso en rutas
 * { path: 'dashboard', component: DashboardComponent }
 * ```
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FeatureCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  /** Signal del usuario actual autenticado */
  currentUser = this.authService.currentUser;
  
  /** Signal del rol del usuario actual */
  userRole = this.authService.userRole;
  
  /** Signal que indica si el usuario es administrador */
  isAdmin = this.authService.isAdmin;
  
  /** 
   * Saludo personalizado basado en el usuario actual
   * @returns Mensaje de saludo con el nombre del usuario
   */
  greeting = computed(() => {
    const user = this.currentUser();
    return user ? `¡Hola, ${user.name}!` : 'Bienvenido';
  });
  
  /**
   * Items del menú filtrados según el rol del usuario
   * @returns Array de elementos de menú disponibles para el usuario
   */
  menuItems = computed(() => {
    const role = this.userRole();
    const items = [
      { 
        title: 'Mi Perfil', 
        icon: 'person', 
        route: '/profile',
        roles: ['admin', 'funcionario', 'tecnico', 'cliente']
      },
      { 
        title: 'Lecturas de Agua', 
        icon: 'water_drop', 
        route: '/readings',
        roles: ['admin', 'funcionario', 'tecnico', 'cliente']
      },
      { 
        title: 'Gestión de Usuarios', 
        icon: 'group', 
        route: '/admin/users',
        roles: ['admin']
      },
      { 
        title: 'Reportes', 
        icon: 'assessment', 
        route: '/under-development',
        roles: ['admin', 'funcionario']
      },
      { 
        title: 'Mantenimiento', 
        icon: 'build', 
        route: '/under-development',
        roles: ['admin', 'funcionario', 'tecnico']
      },
      { 
        title: 'Notificaciones', 
        icon: 'notifications', 
        route: '/under-development',
        roles: ['admin', 'funcionario', 'tecnico', 'cliente']
      },
      { 
        title: 'Configuración', 
        icon: 'settings', 
        route: '/under-development',
        roles: ['admin', 'funcionario']
      }
    ];
    return items.filter(item => role && item.roles.includes(role));
  });

  /**
   * Constructor del componente dashboard
   * @param authService - Servicio de autenticación
   * @param router - Router de Angular para navegación
   * @param notificationService - Servicio de notificaciones
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  /**
   * Inicialización del componente
   */
  ngOnInit(): void {
  }

  /**
   * Navega a una ruta específica
   * @param route - Ruta a la que navegar
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Obtiene el nombre de visualización para un rol de usuario
   * @param role - Rol del usuario
   * @returns Nombre legible del rol en español
   */
  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'admin': 'Administrador',
      'funcionario': 'Funcionario',
      'tecnico': 'Técnico',
      'cliente': 'Cliente'
    };
    return roleNames[role] || role;
  }
  getActionDescription(title: string): string {
    const descriptions: { [key: string]: string } = {
      'Mi Perfil': 'Gestiona tu información personal',
      'Lecturas de Agua': 'Consulta y registra lecturas de medidores',
      'Gestión de Usuarios': 'Administra usuarios del sistema',
      'Reportes': 'Genera reportes y estadísticas',
      'Mantenimiento': 'Gestiona tareas de mantenimiento',
      'Notificaciones': 'Revisa notificaciones del sistema',
      'Configuración': 'Ajusta configuraciones del sistema'
    };
    return descriptions[title] || 'Accede a esta funcionalidad';
  }

  // Métodos de prueba para notificaciones (solo para desarrollo)
  /**
   * Prueba notificación de éxito
   */
  testSuccessNotification(): void {
    this.notificationService.showSuccess('¡Operación completada exitosamente!', 'Excelente');
  }

  /**
   * Prueba notificación de error
   */
  testErrorNotification(): void {
    this.notificationService.showError('Ha ocurrido un error en el sistema', 'Entendido');
  }

  /**
   * Prueba notificación de advertencia
   */
  testWarningNotification(): void {
    this.notificationService.showWarning('Esta acción requiere confirmación', 'Revisar');
  }

  /**
   * Prueba notificación informativa
   */
  testInfoNotification(): void {
    this.notificationService.showInfo('Nueva funcionalidad disponible en el sistema', 'Ver más');
  }

  /**
   * Prueba notificación general
   */
  testGeneralNotification(): void {
    this.notificationService.show('Mensaje general del sistema Mi APR', 'Aceptar');
  }

  /**
   * Prueba notificación de carga
   */
  testLoadingNotification(): void {
    this.notificationService.showLoading('Procesando datos...', 3000);
  }
}
