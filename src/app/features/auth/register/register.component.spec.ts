import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { ValidationService } from '../../../core/services/validation.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

/**
 * Se desarrolla test para componente de register.
 */

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockValidationService: jasmine.SpyObj<ValidationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const validationServiceSpy = jasmine.createSpyObj('ValidationService', ['getPasswordStrength', 'validatePhoneNumber', 'validatePassword', 'validatePasswordConfirmation', 'formatPhoneNumber']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ValidationService, useValue: validationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockValidationService = TestBed.inject(ValidationService) as jasmine.SpyObj<ValidationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // Se configura mock de getPasswordStrength
    mockValidationService.getPasswordStrength.and.returnValue({
      level: 1,
      text: 'Débil',
      color: '#ff5722'
    });

    // Se configura mock de validatePhoneNumber
    mockValidationService.validatePhoneNumber.and.returnValue({
      isValid: true
    });

    // Se configura mock de validatePassword
    mockValidationService.validatePassword.and.returnValue({
      isValid: true
    });

    // Se configura mock de validatePasswordConfirmation
    mockValidationService.validatePasswordConfirmation.and.returnValue({
      isValid: true
    });

    // Se configura mock de formatPhoneNumber
    mockValidationService.formatPhoneNumber.and.returnValue('+56912345678');

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Verifica que el formulario se inicializa correctamente
  it('debería crear el formulario con todos los campos requeridos', () => {
    expect(component.registerForm.get('name')).toBeTruthy();
    expect(component.registerForm.get('lastname')).toBeTruthy();
    expect(component.registerForm.get('email')).toBeTruthy();
    expect(component.registerForm.get('phone')).toBeTruthy();
    expect(component.registerForm.get('role')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
    expect(component.registerForm.get('confirmPassword')).toBeTruthy();
  });

  // Verifica que el formulario es inválido si los campos están vacíos
  it('debería ser inválido cuando los campos están vacíos', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  // Verifica que el formulario es válido con datos correctos
  it('debería ser válido con datos correctos', () => {
    component.registerForm.patchValue({
      name: 'Juan',
      lastname: 'Pérez',
      email: 'juan@example.com',
      phone: '+56912345678',
      role: 'cliente',
      password: 'Password123',
      confirmPassword: 'Password123'
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  // Verifica que el método onSubmit maneja correctamente el registro
  it('debería registrar usuario exitosamente y navegar al dashboard', () => {
    // Se configura formulario válido
    component.registerForm.patchValue({
      name: 'Juan',
      lastname: 'Pérez',
      email: 'juan@example.com',
      phone: '+56912345678',
      role: 'cliente',
      password: 'Password123',
      confirmPassword: 'Password123'
    });
    
    // Se verifica que el formulario es válido
    expect(component.registerForm.valid).toBeTruthy();
    
    // Mock del servicio para simular registro exitoso
    mockAuthService.register.and.returnValue(of({ success: true }));
    
    // Se Ejecuta registro
    component.onSubmit();
    
    // Se verifica que se llamó el servicio de registro
    expect(mockAuthService.register).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // Verifica que el método onSubmit maneja errores de validación
  it('debería manejar error de registro y mostrar mensaje', () => {
    // Se configura formulario válido
    component.registerForm.patchValue({
      name: 'Juan',
      lastname: 'Pérez',
      email: 'juan@example.com',
      phone: '+56912345678',
      role: 'cliente',
      password: 'Password123',
      confirmPassword: 'Password123'
    });
    
    // Se verifica que el formulario es válido
    expect(component.registerForm.valid).toBeTruthy();

    // Mock del servicio para simular error de registro
    mockAuthService.register.and.returnValue(of({ 
      success: false, 
      error: 'Email ya registrado' 
    }));

    // Se ejecuta registro
    component.onSubmit();
    
    // Verificar que se llamó el servicio
    expect(mockAuthService.register).toHaveBeenCalled();
    // Se verifica que no navegó (Caso error)
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
