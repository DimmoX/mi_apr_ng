import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ValidationService } from '../../../core/services/validation.service';
import { UserManagementService } from '../../../core/services/user-management.service';
import { NotificationService } from '../../../core/services/notification.service';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
/**
 * Componente para recuperar la contraseña de un usuario.
 * Permite al usuario ingresar su email para buscar su contraseña.
 * Si se encuentra el usuario, muestra la contraseña y permite copiarla al portapapeles.
 * Si no se encuentra, muestra un mensaje de error.
 * Utiliza Reactive Forms para la validación del email.
 * Incluye un indicador de carga mientras se busca la contraseña.
 * Utiliza servicios de notificación para mostrar mensajes al usuario.
 * Navega al login si el usuario desea volver.
 */
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = signal(false);
  passwordFound = signal(false);
  userPassword = signal('');
  userEmail = signal('');
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private validationService: ValidationService,
    private userManagementService: UserManagementService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading.set(true);
      const email = this.forgotPasswordForm.get('email')?.value;
      this.userManagementService.checkUsers();
      setTimeout(() => {
        this.userManagementService.findUserByEmail(email).subscribe(response => {
          console.log('🔍 Resultado de búsqueda:', response);
          if (response.success && response.user) {
            this.passwordFound.set(true);
            this.userPassword.set(response.user.password);
            this.userEmail.set(email);
            this.notificationService.showSuccess(
              '¡Contraseña encontrada! Puedes copiarla al portapapeles.'
            );
          } else {
            this.notificationService.showError(
              'No se encontró una cuenta asociada a este correo electrónico.'
            );
          }
          this.isLoading.set(false);
        });
      }, 1000); 
    } else {
      this.markFormGroupTouched();
    }
  }
  // Método para marcar todos los controles del formulario como tocados
  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
  // Método para obtener el mensaje de error del email
  getEmailError(): string {
    const emailControl = this.forgotPasswordForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'El email es requerido';
    }
    if (emailControl?.hasError('email')) {
      return 'Ingresa un email válido';
    }
    return '';
  }
  // Método para navegar al login
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.userPassword());
      this.notificationService.showSuccess(
        '¡Contraseña copiada al portapapeles!',
        'Cerrar',
        2000
      );
    } catch (err) {
      this.fallbackCopyTextToClipboard(this.userPassword());
    }
  }
  // Método de respaldo para copiar al portapapeles si Clipboard falla
  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      this.notificationService.showSuccess(
        '¡Contraseña copiada al portapapeles!',
        'Cerrar',
        2000
      );
    } catch (err) {
      this.notificationService.showError(
        'No se pudo copiar la contraseña. Cópiala manualmente.',
        'Cerrar',
        3000
      );
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
