import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserRole } from '../../../core/models/user.model';
import { ValidationService } from '../../../core/services/validation.service';
@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  /**
   * Este componente es un diálogo para crear un nuevo usuario.
   * Utiliza Reactive Forms para la validación y manejo de datos.
   * Incluye campos para nombre, apellido, email, teléfono, rol y contraseña.
   * La contraseña tiene validación de fortaleza y un indicador visual.
   * Los roles disponibles son: Cliente, Técnico, Funcionario y Administrador.
   * El diálogo se cierra con los datos del usuario o sin datos si se cancela
   */
  template: `
    <h2 mat-dialog-title>Crear Nuevo Usuario</h2>
    <div mat-dialog-content>
      <form [formGroup]="userForm" class="create-user-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="name" placeholder="Nombre">
            <mat-icon matSuffix>person</mat-icon>
            <mat-error>{{ getErrorMessage('name') }}</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="lastname" placeholder="Apellido">
            <mat-icon matSuffix>person</mat-icon>
            <mat-error>{{ getErrorMessage('lastname') }}</mat-error>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="usuario@ejemplo.cl">
          <mat-icon matSuffix>email</mat-icon>
          <mat-error>{{ getErrorMessage('email') }}</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="phone" placeholder="+56987654321">
          <mat-icon matSuffix>phone</mat-icon>
          <mat-error>{{ getErrorMessage('phone') }}</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Usuario</mat-label>
          <mat-select formControlName="role">
            <mat-option *ngFor="let role of userRoles" [value]="role.value">
              {{ role.label }}
            </mat-option>
          </mat-select>
          <mat-icon matSuffix>assignment_ind</mat-icon>
          <mat-error>{{ getErrorMessage('role') }}</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contraseña</mat-label>
          <input matInput 
                 [type]="hidePassword() ? 'password' : 'text'"
                 formControlName="password" 
                 placeholder="Mínimo 8 caracteres">
          <button mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="togglePasswordVisibility()">
            <mat-icon>{{ hidePassword() ? 'visibility' : 'visibility_off' }}</mat-icon>
          </button>
          <mat-error>{{ getErrorMessage('password') }}</mat-error>
        </mat-form-field>
        <!-- Password Strength Indicator -->
        <div class="password-strength" *ngIf="userForm.get('password')?.value">
          <mat-progress-bar 
            mode="determinate" 
            [value]="passwordStrength().level * 25"
            [color]="passwordStrength().level >= 3 ? 'primary' : 'warn'">
          </mat-progress-bar>
          <span class="strength-text" [style.color]="passwordStrength().color">
            Fortaleza: {{ passwordStrength().text }}
          </span>
        </div>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button 
              color="primary" 
              (click)="onCreate()"
              [disabled]="userForm.invalid">
        <mat-icon>add</mat-icon>
        Crear Usuario
      </button>
    </div>
  `,
  styles: [`
    .create-user-form {
      min-width: 400px;
      padding: 1rem 0;
      .form-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        .half-width {
          flex: 1;
        }
      }
      .full-width {
        width: 100%;
        margin-bottom: 1rem;
      }
      .password-strength {
        margin-top: -0.5rem;
        margin-bottom: 1rem;
        .strength-text {
          font-size: 0.8rem;
          margin-top: 0.25rem;
          display: block;
        }
      }
    }
    @media (max-width: 600px) {
      .create-user-form {
        min-width: 300px;
        .form-row {
          flex-direction: column;
          gap: 0;
        }
      }
    }
  `]
})
export class CreateUserDialogComponent {
  userForm: FormGroup;
  hidePassword = signal(true);
  passwordStrength = signal({ level: 0, text: 'Muy débil', color: '#9e9e9e' });
  userRoles: { value: UserRole; label: string }[] = [
    { value: 'cliente', label: 'Cliente' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'funcionario', label: 'Funcionario' },
    { value: 'admin', label: 'Administrador' }
  ];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private validationService: ValidationService
  ) {
    this.userForm = this.createForm();
    this.setupPasswordValidation();
  }
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator.bind(this)]],
      role: ['cliente', [Validators.required]],
      password: ['', [Validators.required, this.passwordValidator.bind(this)]]
    });
  }
  private setupPasswordValidation(): void {
    const passwordControl = this.userForm.get('password');
    passwordControl?.valueChanges.subscribe(password => {
      if (password) {
        const strength = this.validationService.getPasswordStrength(password);
        this.passwordStrength.set(strength);
      } else {
        this.passwordStrength.set({ level: 0, text: 'Muy débil', color: '#9e9e9e' });
      }
    });
  }
  private phoneValidator(control: any): { [key: string]: any } | null {
    const phone = control.value;
    if (!phone) return null;
    return this.validationService.validatePhoneNumber(phone) 
      ? null 
      : { invalidPhone: true };
  }
  private passwordValidator(control: any): { [key: string]: any } | null {
    const password = control.value;
    if (!password) return null;
    return this.validationService.validatePassword(password) 
      ? null 
      : { invalidPassword: true };
  }
  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }
  getErrorMessage(field: string): string {
    const control = this.userForm.get(field);
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
    if (control?.hasError('invalidPassword')) {
      return 'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo';
    }
    return '';
  }
  onCreate(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      userData.phone = this.validationService.formatPhoneNumber(userData.phone);
      this.dialogRef.close(userData);
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
