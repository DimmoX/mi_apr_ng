import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { signal, WritableSignal, computed } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { of } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

/**
 * Tests para el componente NavbarComponent
 * 
 * Cubre:
 * - Creación del componente
 * - Navegación
 * - Estados de autenticación
 * - Comportamiento responsive
 * - Roles de usuario
 * - Funcionalidad de logout
 */
describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let currentUserSignal: WritableSignal<User | null>;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    name: 'Test User',
    lastname: 'Test Lastname',
    phone: '+56912345678',
    role: 'admin',
    password: 'hashedPassword',
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(async () => {
    // Crear signals para el mock
    currentUserSignal = signal<User | null>(null);

    // Crear mocks de los servicios
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser: currentUserSignal,
      isAuthenticated: computed(() => currentUserSignal() !== null)
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['isMatched', 'observe']);
    mockBreakpointObserver.isMatched.and.returnValue(false);
    mockBreakpointObserver.observe.and.returnValue(of({ matches: false, breakpoints: {} } as BreakpointState));

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        NoopAnimationsModule,
        LayoutModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  describe('Creación del componente', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades correctamente', () => {
      expect(component.currentUser).toBeDefined();
      expect(component.isAuthenticated).toBeDefined();
      expect(component.publicNavItems).toEqual([
        { path: '/home', label: 'Inicio', icon: 'home' },
        { path: '/about', label: 'Nosotros', icon: 'info' },
        { path: '/contact', label: 'Contacto', icon: 'contact_mail' }
      ]);
    });
  });

  describe('Navegación', () => {
    it('debería navegar al login', () => {
      component.navigateToLogin();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('debería navegar al registro', () => {
      component.navigateToRegister();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('debería navegar al dashboard', () => {
      spyOn(console, 'log'); // Evitar logs en tests
      component.navigateToDashboard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('debería navegar al perfil', () => {
      component.navigateToProfile();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('debería navegar a lecturas', () => {
      component.navigateToReadings();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/readings']);
    });

    it('debería navegar a gestión de usuarios', () => {
      component.navigateToUserManagement();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/users']);
    });
  });

  describe('Autenticación', () => {
    it('debería llamar al método logout del servicio', () => {
      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('debería detectar si el usuario es admin', () => {
      // Usuario no admin
      currentUserSignal.set({ ...mockUser, role: 'cliente' });
      expect(component.isAdmin()).toBeFalse();

      // Usuario admin
      currentUserSignal.set({ ...mockUser, role: 'admin' });
      expect(component.isAdmin()).toBeTrue();

      // Sin usuario
      currentUserSignal.set(null);
      expect(component.isAdmin()).toBeFalse();
    });
  });

  describe('Comportamiento responsive', () => {
    it('debería detectar dispositivos móviles', () => {
      mockBreakpointObserver.isMatched.and.returnValue(true);
      const isMobile = component.isMobile();
      expect(isMobile).toBeTrue();
      expect(mockBreakpointObserver.isMatched).toHaveBeenCalledWith('(max-width: 768px)');
    });

    it('debería detectar dispositivos desktop', () => {
      mockBreakpointObserver.isMatched.and.returnValue(false);
      const isMobile = component.isMobile();
      expect(isMobile).toBeFalse();
    });
  });

  describe('Roles de usuario', () => {
    it('debería retornar nombres de rol correctos', () => {
      expect(component.getRoleDisplayName('admin')).toBe('Administrador');
      expect(component.getRoleDisplayName('funcionario')).toBe('Funcionario');
      expect(component.getRoleDisplayName('tecnico')).toBe('Técnico');
      expect(component.getRoleDisplayName('cliente')).toBe('Cliente');
      expect(component.getRoleDisplayName('unknown')).toBe('unknown');
    });
  });
});
