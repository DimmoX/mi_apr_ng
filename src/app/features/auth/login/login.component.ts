import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ValidationService } from '../../../core/services/validation.service';
import { NotificationService } from '../../../core/services/notification.service';
@Component({
  selector: 'app-login',
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
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
/**
 * Componente de inicio de sesión.
 * Permite a los usuarios ingresar su email y contraseña para autenticarse.
 * Utiliza Reactive Forms para la validación de los campos.
 * Incluye un indicador de carga mientras se procesa el inicio de sesión.
 * Muestra mensajes de error o éxito utilizando el servicio de notificaciones.
 * Navega a la URL de retorno después de un inicio de sesión exitoso.
 * Proporciona enlaces para registro y recuperación de contraseña.
 * Utiliza señales para manejar el estado de carga y visibilidad de la contraseña.
 */
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = signal(false);
  hidePassword = signal(true);
  returnUrl = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private validationService: ValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.createForm();
  }
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }
  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    this.isLoading.set(true);
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        if (result.success) {
          this.notificationService.showSuccess('Inicio de sesión exitoso');
          this.router.navigate([this.returnUrl]);
        } else {
          this.notificationService.showError(result.error || 'Error al iniciar sesión');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.showError('Error del sistema');
      }
    });
  }
  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
  getEmailError(): string {
    const control = this.loginForm.get('email');
    if (control?.hasError('required')) {
      return 'El email es requerido';
    }
    if (control?.hasError('email')) {
      return 'Formato de email inválido';
    }
    return '';
  }
  getPasswordError(): string {
    const control = this.loginForm.get('password');
    if (control?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    return '';
  }
}
