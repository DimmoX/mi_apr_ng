import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { MeterManagementService } from '../../core/services/meter-management.service';
import { DataInitService } from '../../core/services/data-init.service';
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
    MatMenuModule,
    MatDividerModule,
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

  /** Flag para controlar si se ha descartado la alerta de medidor */
  private meterAlertDismissed = false;
  
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
        title: 'Mis Medidores', 
        icon: 'device_hub', 
        route: '/my-meters',
        roles: ['cliente']
      },
      { 
        title: 'Gestión de Medidores', 
        icon: 'build_circle', 
        route: '/meter-management',
        roles: ['admin', 'funcionario', 'tecnico']
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
   * @param meterService - Servicio de gestión de medidores
   * @param dataInitService - Servicio de inicialización de datos
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private meterService: MeterManagementService,
    private dataInitService: DataInitService
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

  /**
   * Verifica si debe mostrar la alerta de registro de medidor
   * @returns true si es cliente y no tiene medidores ni solicitudes pendientes
   */
  shouldShowMeterAlert(): boolean {
    const user = this.currentUser();
    const role = this.userRole();
    
    if (role !== 'cliente' || !user || this.meterAlertDismissed) {
      return false;
    }
    
    return this.meterService.shouldShowMeterRegistration(user.id);
  }

  /**
   * Descarta la alerta de medidor
   */
  dismissMeterAlert(): void {
    this.meterAlertDismissed = true;
  }

  /**
   * Navega a la página de Mis Medidores
   */
  navigateToMyMeters(): void {
    this.router.navigate(['/my-meters']);
  }

  /**
   * Obtiene la descripción de la acción para un título dado
   * @param title - Título de la acción
   * @returns Descripción de la acción
   */
  getActionDescription(title: string): string {
    const descriptions: { [key: string]: string } = {
      'Mi Perfil': 'Gestiona tu información personal',
      'Lecturas de Agua': 'Consulta y registra lecturas de medidores',
      'Mis Medidores': 'Gestiona tus medidores de agua',
      'Gestión de Medidores': 'Administra solicitudes de registro de medidores',
      'Gestión de Usuarios': 'Administra usuarios del sistema',
      'Reportes': 'Genera reportes y estadísticas',
      'Mantenimiento': 'Gestiona tareas de mantenimiento',
      'Notificaciones': 'Revisa notificaciones del sistema',
      'Configuración': 'Ajusta configuraciones del sistema'
    };
    return descriptions[title] || 'Accede a esta funcionalidad';
  }

  /**
   * Obtiene el icono del avatar del usuario según su rol
   */
  getUserAvatarIcon(): string {
    const role = this.userRole();
    const icons: { [key: string]: string } = {
      'admin': 'admin_panel_settings',
      'funcionario': 'work',
      'tecnico': 'build',
      'cliente': 'person'
    };
    return icons[role || ''] || 'person';
  }

  /**
   * Obtiene la clase CSS para el estado del usuario
   */
  getUserStatusClass(): string {
    return 'online'; // Por simplicidad, todos los usuarios están "en línea"
  }

  /**
   * Obtiene el icono del rol del usuario
   */
  getRoleIcon(): string {
    const role = this.userRole();
    const icons: { [key: string]: string } = {
      'admin': 'shield',
      'funcionario': 'badge',
      'tecnico': 'engineering',
      'cliente': 'person_outline'
    };
    return icons[role || ''] || 'person_outline';
  }

  /**
   * Formatea una fecha para mostrar
   */
  getFormattedDate(dateString?: string): string {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'Fecha inválida';
    }
  }

  /**
   * Obtiene la cantidad de medidores activos del usuario
   */
  getUserMeterCount(): number {
    const user = this.currentUser();
    if (!user) return 0;
    const meters = this.dataInitService.getUserMeters(user.id);
    return meters.filter(meter => meter.estado === 'activo').length;
  }

  /**
   * Obtiene la cantidad de lecturas del usuario
   */
  getUserReadingCount(): number {
    const user = this.currentUser();
    if (!user) return 0;
    const readings = this.dataInitService.getUserReadings(user.id);
    return readings.length;
  }

  /**
   * Verifica si el usuario es admin o funcionario
   */
  isAdminOrFuncionario(): boolean {
    const role = this.userRole();
    return role === 'admin' || role === 'funcionario';
  }

  /**
   * Obtiene el texto del nivel de acceso
   */
  getAccessLevelText(): string {
    const role = this.userRole();
    const levels: { [key: string]: string } = {
      'admin': 'Acceso Total',
      'funcionario': 'Acceso Administrativo',
      'tecnico': 'Acceso Técnico',
      'cliente': 'Acceso Básico'
    };
    return levels[role || ''] || 'No definido';
  }

  /**
   * Obtiene el texto del último acceso
   */
  getLastAccessText(): string {
    return 'Ahora'; // Por simplicidad
  }

  /**
   * Obtiene el consumo del mes actual
   */
  getCurrentMonthConsumption(): string {
    // Simulación de datos
    return '12.5';
  }

  /**
   * Obtiene los pagos pendientes
   */
  getPendingPayments(): string {
    // Simulación de datos
    return '2';
  }

  /**
   * Obtiene las lecturas de este año
   */
  getReadingsThisYear(): string {
    const user = this.currentUser();
    if (!user) return '0';
    const readings = this.dataInitService.getUserReadings(user.id);
    const currentYear = new Date().getFullYear();
    const thisYearReadings = readings.filter(reading => {
      const readingYear = new Date(reading.fechaLectura).getFullYear();
      return readingYear === currentYear;
    });
    return thisYearReadings.length.toString();
  }
}
