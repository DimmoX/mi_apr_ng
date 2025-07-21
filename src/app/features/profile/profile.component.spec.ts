import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../core/models/user.model';

/**
 * Desarrollo de tests para el componente ProfileComponent.
 */
describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  // Mock de usuario para las pruebas - corregido según la interfaz User
  const mockUser: User = {
    id: 1,
    name: 'Juan',
    lastname: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+56912345678',
    role: 'cliente' as UserRole,
    password: '',
    createdAt: '2025-07-21T10:00:00Z'
  };

  beforeEach(async () => {
    // Creación de spy para el servicio AuthService únicamente
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserRoleDisplayName'], {
      currentUser: signal(mockUser)
    });

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    // Configuración de localStorage antes de crear el componente
    localStorage.setItem('apr_users', JSON.stringify([mockUser]));

    // Configuración de mocks
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    // Configuración de métodos mock
    mockAuthService.getUserRoleDisplayName.and.returnValue('Cliente');

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    
    // Asegurar que el componente tenga acceso al usuario mockeado
    component.currentUser = signal(mockUser);
    
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Valida que el componente se instancie correctamente
  it('debería crear el componente correctamente', () => {
    // Validación: El componente debe existir y ser una instancia válida
    expect(component).toBeTruthy();
  });

  // Valida que el formulario se llene con los datos del usuario actual
  it('debería inicializar el formulario con los datos del usuario actual', () => {
    // Validaciones: Verificar que cada campo del formulario tenga el valor correcto
    // El formulario ya debería estar inicializado en ngOnInit
    expect(component.profileForm.get('name')?.value).toBe(mockUser.name);
    expect(component.profileForm.get('lastname')?.value).toBe(mockUser.lastname);
    expect(component.profileForm.get('email')?.value).toBe(mockUser.email);
    expect(component.profileForm.get('phone')?.value).toBe(mockUser.phone);
  });

  // Valida que el formulario tenga las validaciones correctas
  it('debería validar correctamente los campos requeridos del formulario', () => {
    // Configuración: Limpiar los campos editables para probar validación
    component.profileForm.patchValue({
      name: '',
      lastname: '',
      email: '',
      phone: ''
    });
    
    // Marcar los campos como touched para activar las validaciones
    component.profileForm.markAllAsTouched();

    // Validaciones: Verificar que los campos requeridos sean inválidos cuando están vacíos
    expect(component.profileForm.get('name')?.invalid).toBeTruthy();
    expect(component.profileForm.get('lastname')?.invalid).toBeTruthy();
    expect(component.profileForm.get('email')?.invalid).toBeTruthy();
    expect(component.profileForm.get('phone')?.invalid).toBeTruthy();
    
    // Validación: El formulario completo debe ser inválido
    expect(component.profileForm.invalid).toBeTruthy();
  });

  // Valida que el formulario se vuelva válido cuando se ingresan datos correctos
  it('debería validar correctamente cuando el formulario tiene datos válidos', () => {
    // Configuración: Formulario válido con datos de prueba
    component.profileForm.patchValue({
      name: 'Carlos',
      lastname: 'González',
      email: 'carlos.gonzalez@example.com',
      phone: '+56987654321'
    });

    // Validación: El formulario debe ser válido con datos correctos
    expect(component.profileForm.valid).toBeTruthy();
  });

  // Valida que el método onSubmit se ejecute correctamente con formulario válido
  it('debería ejecutar onSubmit correctamente cuando el formulario es válido', () => {
    // Configuración: Formulario válido con datos de prueba
    component.profileForm.patchValue({
      name: 'Carlos',
      lastname: 'González',
      email: 'carlos.gonzalez@example.com',
      phone: '+56987654321'
    });

    // Verifica que el formulario sea válido antes de continuar
    expect(component.profileForm.valid).toBeTruthy();

    // Verifica que isLoading esté en false inicialmente (acceder como propiedad)
    expect(component.isLoading).toBeFalsy();

    // Acción: Ejecutar el método de actualización
    component.onSubmit();

    // Validación: Verificar que el formulario sigue siendo válido después del submit
    expect(component.profileForm.valid).toBeTruthy();
  });
});