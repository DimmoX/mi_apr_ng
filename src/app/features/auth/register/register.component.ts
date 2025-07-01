import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ValidationService } from '../../../core/services/validation.service';
@Component({
  selector: 'app-register',
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
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  passwordStrength = signal({ level: 0, text: 'Muy débil', color: '#9e9e9e' });
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private validationService: ValidationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.createForm();
    this.setupPasswordValidation();
  }
  ngOnInit(): void {
  }
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator.bind(this)]],
      role: ['cliente', [Validators.required]],
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  private setupPasswordValidation(): void {
    const passwordControl = this.registerForm.get('password');
    passwordControl?.valueChanges.subscribe(password => {
      if (password) {
        const strength = this.validationService.getPasswordStrength(password);
        this.passwordStrength.set(strength);
      } else {
        this.passwordStrength.set({ level: 0, text: 'Muy débil', color: '#9e9e9e' });
      }
    });
  }
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    this.isLoading.set(true);
    const userData = this.registerForm.value;
    userData.phone = this.validationService.formatPhoneNumber(userData.phone);
    const { confirmPassword, ...userDataToSend } = userData;
    this.authService.register(userDataToSend).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        if (result.success) {
          this.snackBar.open('Registro exitoso. Bienvenido!', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        } else {
          this.snackBar.open(result.error || 'Error al registrar usuario', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Error del sistema', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  private phoneValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    const validation = this.validationService.validatePhoneNumber(control.value);
    return validation.isValid ? null : { phoneInvalid: { message: validation.message } };
  }
  private passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    const validation = this.validationService.validatePassword(control.value);
    return validation.isValid ? null : { passwordWeak: { message: validation.message } };
  }
  private passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (!password || !confirmPassword) return null;
    const validation = this.validationService.validatePasswordConfirmation(password, confirmPassword);
    return validation.isValid ? null : { passwordMismatch: { message: validation.message } };
  }
  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
  getNameError(): string {
    const control = this.registerForm.get('name');
    if (control?.hasError('required')) return 'El nombre es requerido';
    if (control?.hasError('minlength')) return 'El nombre debe tener al menos 2 caracteres';
    if (control?.hasError('maxlength')) return 'El nombre no puede exceder 50 caracteres';
    return '';
  }
  getLastnameError(): string {
    const control = this.registerForm.get('lastname');
    if (control?.hasError('required')) return 'El apellido es requerido';
    if (control?.hasError('minlength')) return 'El apellido debe tener al menos 2 caracteres';
    if (control?.hasError('maxlength')) return 'El apellido no puede exceder 50 caracteres';
    return '';
  }
  getEmailError(): string {
    const control = this.registerForm.get('email');
    if (control?.hasError('required')) return 'El email es requerido';
    if (control?.hasError('email')) return 'Formato de email inválido';
    return '';
  }
  getPhoneError(): string {
    const control = this.registerForm.get('phone');
    if (control?.hasError('required')) return 'El teléfono es requerido';
    if (control?.hasError('phoneInvalid')) return control.errors?.['phoneInvalid'].message;
    return '';
  }
  getPasswordError(): string {
    const control = this.registerForm.get('password');
    if (control?.hasError('required')) return 'La contraseña es requerida';
    if (control?.hasError('passwordWeak')) return control.errors?.['passwordWeak'].message;
    return '';
  }
  getConfirmPasswordError(): string {
    const control = this.registerForm.get('confirmPassword');
    if (control?.hasError('required')) return 'La confirmación de contraseña es requerida';
    if (this.registerForm.hasError('passwordMismatch')) {
      return this.registerForm.errors?.['passwordMismatch'].message;
    }
    return '';
  }
}
