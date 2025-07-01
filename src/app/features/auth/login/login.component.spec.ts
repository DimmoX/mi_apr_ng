import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { ValidationService } from '../../../core/services/validation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';

/**
 * Tests para el componente LoginComponent
 * 
 * Cubre:
 * - Creación del componente
 * - Validación de formularios
 * - Login exitoso y fallido
 * - Navegación
 * - Estados de carga
 * - Visibilidad de contraseña
 * - Manejo de errores
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockValidationService: jasmine.SpyObj<ValidationService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockActivatedRoute: any;

  const mockUser: User = {
    id: '1',
    name: 'Test',
    lastname: 'User',
    email: 'test@test.com',
    phone: '+56912345678',
    role: 'cliente',
    password: 'hashedPassword',
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(async () => {
    // Crear mocks de los servicios
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockValidationService = jasmine.createSpyObj('ValidationService', ['validateEmail']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError'
    ]);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    mockActivatedRoute = {
      snapshot: {
        queryParams: { returnUrl: '/dashboard' }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ValidationService, useValue: mockValidationService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  describe('Creación del componente', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario correctamente', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('email')).toBeDefined();
      expect(component.loginForm.get('password')).toBeDefined();
    });

    it('debería inicializar las propiedades correctamente', () => {
      component.ngOnInit();
      expect(component.isLoading()).toBeFalse();
      expect(component.hidePassword()).toBeTrue();
      expect(component.returnUrl).toBe('/dashboard');
    });
  });

  describe('Validación del formulario', () => {
    it('debería ser inválido cuando esté vacío', () => {
      expect(component.loginForm.invalid).toBeTrue();
    });

    it('debería requerir email', () => {
      const emailControl = component.loginForm.get('email');
      expect(emailControl?.hasError('required')).toBeTrue();
    });

    it('debería requerir contraseña', () => {
      const passwordControl = component.loginForm.get('password');
      expect(passwordControl?.hasError('required')).toBeTrue();
    });

    it('debería validar formato de email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTrue();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBeFalse();
    });

    it('debería validar longitud mínima de contraseña', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('minlength')).toBeTrue();

      passwordControl?.setValue('12345678');
      expect(passwordControl?.hasError('minlength')).toBeFalse();
    });

    it('debería ser válido con datos correctos', () => {
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'password123'
      });
      expect(component.loginForm.valid).toBeTrue();
    });
  });

  describe('Login exitoso', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'password123'
      });
    });

    it('debería hacer login exitoso y navegar al dashboard', () => {
      component.ngOnInit(); // Inicializar returnUrl
      const loginResponse = { success: true, user: mockUser };
      mockAuthService.login.and.returnValue(of(loginResponse));

      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      });
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Inicio de sesión exitoso');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(component.isLoading()).toBeFalse();
    });
  });

  describe('Login fallido', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    });

    it('debería manejar error de credenciales incorrectas', () => {
      const loginResponse = { success: false, error: 'Credenciales incorrectas' };
      mockAuthService.login.and.returnValue(of(loginResponse));

      component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith('Credenciales incorrectas');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(component.isLoading()).toBeFalse();
    });

    it('debería manejar errores del servidor', () => {
      mockAuthService.login.and.returnValue(throwError(() => new Error('Server error')));

      component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith('Error del sistema');
      expect(component.isLoading()).toBeFalse();
    });
  });

  describe('Validación durante submit', () => {
    it('no debería enviar formulario inválido', () => {
      component.loginForm.patchValue({
        email: 'invalid-email',
        password: '123'
      });

      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('Visibilidad de contraseña', () => {
    it('debería alternar visibilidad de contraseña', () => {
      expect(component.hidePassword()).toBeTrue();
      
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBeFalse();
      
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBeTrue();
    });
  });

  describe('Navegación', () => {
    it('debería navegar al registro', () => {
      component.navigateToRegister();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('debería navegar a forgot password', () => {
      component.navigateToForgotPassword();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/forgot-password']);
    });
  });

  describe('Manejo de errores del formulario', () => {
    beforeEach(() => {
      // Hacer que los controles estén touched para que muestren errores
      component.loginForm.get('email')?.markAsTouched();
      component.loginForm.get('password')?.markAsTouched();
    });

    it('debería retornar error de email requerido', () => {
      component.loginForm.get('email')?.setValue('');
      expect(component.getEmailError()).toBe('El email es requerido');
    });

    it('debería retornar error de formato de email', () => {
      component.loginForm.get('email')?.setValue('invalid-email');
      expect(component.getEmailError()).toBe('Formato de email inválido');
    });

    it('debería retornar string vacío si email es válido', () => {
      component.loginForm.get('email')?.setValue('valid@email.com');
      expect(component.getEmailError()).toBe('');
    });

    it('debería retornar error de contraseña requerida', () => {
      component.loginForm.get('password')?.setValue('');
      expect(component.getPasswordError()).toBe('La contraseña es requerida');
    });

    it('debería retornar error de longitud mínima de contraseña', () => {
      component.loginForm.get('password')?.setValue('123');
      expect(component.getPasswordError()).toBe('La contraseña debe tener al menos 8 caracteres');
    });

    it('debería retornar string vacío si contraseña es válida', () => {
      component.loginForm.get('password')?.setValue('validpassword');
      expect(component.getPasswordError()).toBe('');
    });
  });
});
