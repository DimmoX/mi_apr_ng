import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ValidationService } from '../../core/services/validation.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ActionButtonComponent } from '../../components/action-button/action-button.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    PageHeaderComponent,
    ActionButtonComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
/**
 * Componente para gestionar el perfil del usuario
 * @description Permite a los usuarios ver y editar su información personal, incluyendo nombre, apellido, email y teléfono.
 */
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser = this.authService.currentUser;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private validationService: ValidationService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.profileForm = this.createForm();
  }
  ngOnInit(): void {
    this.loadUserData();
  }
  /**
   * Crea el formulario de perfil
   * @returns FormGroup - El formulario reactivo con los campos necesarios para el perfil del usuario.
   * @description Define los campos del formulario con sus validaciones:
   * - name: Requerido, mínimo 2 caracteres
   * - lastname: Requerido, mínimo 2 caracteres
   * - email: Requerido, formato de email válido
   * - phone: Requerido, validado con un validador personalizado para el formato de teléfono
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator.bind(this)]]
    });
  }
  /**
   * Carga los datos del usuario en el formulario
   * @description Obtiene el usuario actual del servicio de autenticación y llena el formulario con sus datos.
   * Si no hay usuario autenticado, el formulario permanecerá vacío.
   */
  private loadUserData(): void {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone
      });
    }
  }
  /**
   * Valida el formato del número de teléfono
   * @param control 
   * @description Utiliza el servicio de validación para verificar que el número de teléfono tenga el formato correcto.
   * El formato esperado es: +56XXXXXXXXX (código de país +56 seguido de 9 dígitos).
   */
  private phoneValidator(control: any): { [key: string]: any } | null {
    const phone = control.value;
    if (!phone) return null;
    return this.validationService.validatePhoneNumber(phone) 
      ? null 
      : { invalidPhone: true };
  }
  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    this.isLoading = true;
    const formData = this.profileForm.value;
    const currentUserData = this.currentUser();
    if (!currentUserData) {
      this.notificationService.showError('Error: Usuario no encontrado');
      this.isLoading = false;
      return;
    }
    formData.phone = this.validationService.formatPhoneNumber(formData.phone);
    const updatedUser: User = {
      ...currentUserData,
      ...formData
    };
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('apr_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('apr_users', JSON.stringify(users));
        this.authService.setCurrentUser(updatedUser);
        this.notificationService.showSuccess('Perfil actualizado correctamente');
      } else {
        this.notificationService.showError('Error al actualizar el perfil');
      }
      this.isLoading = false;
    }, 1000);
  }
  /**
   * Marca todos los controles del formulario como tocados
   * @description Utiliza esta función para asegurarse de que todos los campos del formulario muestren sus mensajes de error si el formulario es inválido.
   */
  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      this.profileForm.get(key)?.markAsTouched();
    });
  }
  /**
   * Obtiene el mensaje de error para un campo específico del formulario
   * @param field El nombre del campo del formulario
   * @returns El mensaje de error correspondiente o una cadena vacía si no hay errores
   */
  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }
    if (control?.hasError('invalidPhone')) {
      return 'Formato de teléfono inválido (+56XXXXXXXXX)';
    }
    return '';
  }
  /**
   * Navega a la página de inicio
   * @description Redirige al usuario a la página de inicio del dashboard.
   * Utiliza el router de Angular para cambiar la ruta actual.
   */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
