import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Servicio de notificaciones para mostrar mensajes al usuario.
 * 
 * @description Este servicio proporciona métodos para mostrar diferentes tipos de notificaciones
 * (success, error, warning, info) con estilos consistentes y posicionamiento en la esquina superior derecha.
 * Utiliza la paleta de colores de la aplicación para mantener la coherencia visual.
 * 
 * @example
 * ```typescript
 * constructor(private notificationService: NotificationService) {}
 * 
 * // Mostrar diferentes tipos de notificaciones
 * this.notificationService.showSuccess('Operación completada exitosamente');
 * this.notificationService.showError('Ha ocurrido un error');
 * this.notificationService.showWarning('Advertencia importante');
 * this.notificationService.showInfo('Información relevante');
 * ```
 * 
 * @author Equipo de Desarrollo Mi APR
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Configuración predeterminada para todas las notificaciones
   * - Posición: esquina superior derecha
   * - Duración: 3 segundos
   * - Clase CSS personalizada para estilos
   */
  private getDefaultConfig(): MatSnackBarConfig {
    return {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['custom-snackbar']
    };
  }
  /**
   * Muestra una notificación de éxito (verde)
   * @param message - Mensaje a mostrar
   * @param action - Texto del botón de acción (por defecto: "Cerrar")
   * @param duration - Duración en milisegundos (por defecto: 3000)
   */
  showSuccess(message: string, action: string = 'Cerrar', duration?: number): void {
    const config = {
      ...this.getDefaultConfig(),
      duration: duration || 3000,
      panelClass: ['success-snackbar', 'custom-snackbar']
    };
    this.snackBar.open(message, action, config);
  }

  /**
   * Muestra una notificación de error (rojo)
   * @param message - Mensaje a mostrar
   * @param action - Texto del botón de acción (por defecto: "Cerrar")
   * @param duration - Duración en milisegundos (por defecto: 5000)
   */
  showError(message: string, action: string = 'Cerrar', duration?: number): void {
    const config = {
      ...this.getDefaultConfig(),
      duration: duration || 5000,
      panelClass: ['error-snackbar', 'custom-snackbar']
    };
    this.snackBar.open(message, action, config);
  }

  /**
   * Muestra una notificación de advertencia (naranja)
   * @param message - Mensaje a mostrar
   * @param action - Texto del botón de acción (por defecto: "Cerrar")
   * @param duration - Duración en milisegundos (por defecto: 4000)
   */
  showWarning(message: string, action: string = 'Cerrar', duration?: number): void {
    const config = {
      ...this.getDefaultConfig(),
      duration: duration || 4000,
      panelClass: ['warning-snackbar', 'custom-snackbar']
    };
    this.snackBar.open(message, action, config);
  }

  /**
   * Muestra una notificación informativa (azul de la paleta de la aplicación)
   * @param message - Mensaje a mostrar
   * @param action - Texto del botón de acción (por defecto: "Cerrar")
   * @param duration - Duración en milisegundos (por defecto: 3000)
   */
  showInfo(message: string, action: string = 'Cerrar', duration?: number): void {
    const config = {
      ...this.getDefaultConfig(),
      duration: duration || 3000,
      panelClass: ['info-snackbar', 'custom-snackbar']
    };
    this.snackBar.open(message, action, config);
  }

  /**
   * Muestra una notificación general con la paleta de colores de la aplicación
   * @param message - Mensaje a mostrar
   * @param action - Texto del botón de acción (por defecto: "Cerrar")
   * @param customConfig - Configuración personalizada opcional
   */
  show(message: string, action: string = 'Cerrar', customConfig?: Partial<MatSnackBarConfig>): void {
    const config = {
      ...this.getDefaultConfig(),
      ...customConfig
    };
    this.snackBar.open(message, action, config);
  }

  /**
   * Muestra una notificación de carga/procesamiento
   * @param message - Mensaje a mostrar (por defecto: "Procesando...")
   * @param duration - Duración en milisegundos (por defecto: indefinido)
   */
  showLoading(message: string = 'Procesando...', duration?: number): void {
    const config = {
      ...this.getDefaultConfig(),
      duration: duration || 0, // 0 = no se cierra automáticamente
      panelClass: ['info-snackbar', 'custom-snackbar'],
      horizontalPosition: 'right' as const,
      verticalPosition: 'top' as const
    };
    this.snackBar.open(message, '', config);
  }

  /**
   * Cierra todas las notificaciones activas
   */
  dismissAll(): void {
    this.snackBar.dismiss();
  }
}
