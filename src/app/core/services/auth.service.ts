import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginCredentials, UserRole } from '../models/user.model';

/**
 * Servicio de autenticación y autorización para el sistema APR.
 * 
 * Este servicio gestiona la autenticación de usuarios, el control de acceso basado en roles,
 * y proporciona métodos para login, logout y verificación de permisos.
 * 
 * @description Utiliza localStorage para persistir la sesión del usuario y signals de Angular
 * para gestión reactiva del estado de autenticación.
 * 
 * @example
 * ```typescript
 * constructor(private authService: AuthService) {
 *   // Verificar si el usuario está autenticado
 *   if (this.authService.isAuthenticated()) {
 *     console.log('Usuario autenticado:', this.authService.currentUser());
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Clave para almacenar datos del usuario actual en localStorage */
  private readonly STORAGE_KEY = 'apr_current_user';
  
  /** Clave para almacenar la lista de usuarios en localStorage */
  private readonly USERS_KEY = 'apr_users';
  
  /** Signal que contiene la información del usuario actual */
  private currentUserSignal = signal<User | null>(null);
  
  /** BehaviorSubject para compatibilidad con observables */
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  /** Signal de solo lectura del usuario actual */
  currentUser = this.currentUserSignal.asReadonly();
  
  /** Observable del usuario actual para compatibilidad con RxJS */
  currentUser$ = this.currentUserSubject.asObservable();
  
  /** computed que indica si hay un usuario autenticado */
  isAuthenticated = computed(() => this.currentUser() !== null);
  
  /** computed que retorna el rol del usuario actual */
  userRole = computed(() => this.currentUser()?.role || null);
  
  /** computed que indica si el usuario actual es administrador */
  isAdmin = computed(() => this.userRole() === 'admin');
  
  /** computed que indica si el usuario actual es funcionario */
  isFuncionario = computed(() => this.userRole() === 'funcionario');

  /** computed que indica si el usuario actual es técnico */
  isTecnico = computed(() => this.userRole() === 'tecnico');

  /** computed que indica si el usuario actual es cliente */
  isCliente = computed(() => this.userRole() === 'cliente');

  constructor(private router: Router) {
    this.loadCurrentUser();
  }

  /**
   * Inicializa la sesión del usuario desde localStorage
   * @private
   */
  private loadCurrentUser(): void {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      if (userData) {
        const user = JSON.parse(userData);
        this.setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading user session:', error);
      this.clearSession();
    }
  }
  /**
   * Verifica si el usuario está autenticado
   */
  login(credentials: LoginCredentials): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      try {
        const users = this.getAllUsers();
        const user = users.find(u => 
          u.email.toLowerCase() === credentials.email.toLowerCase() && 
          u.password === credentials.password
        );
        if (user) {
          this.setCurrentUser(user);
          observer.next({ success: true, user });
        } else {
          observer.next({ success: false, error: 'Email o contraseña incorrectos' });
        }
      } catch (error) {
        observer.next({ success: false, error: 'Error al iniciar sesión' });
      }
      observer.complete();
    });
  }
  /**
   * Registra un nuevo usuario en el sistema
   */
  register(userData: Omit<User, 'id' | 'createdAt'>): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      try {
        const users = this.getAllUsers();
        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
          observer.next({ success: false, error: 'El email ya está registrado' });
          observer.complete();
          return;
        }
        const newUser: User = {
          ...userData,
          id: this.generateUserId(),
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        this.saveUsers(users);
        this.setCurrentUser(newUser);
        observer.next({ success: true, user: newUser });
      } catch (error) {
        observer.next({ success: false, error: 'Error al registrar usuario' });
      }
      observer.complete();
    });
  }
  /**
   * Cierra la sesión del usuario actual
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }
  /**
   * Actualiza el perfil del usuario actual
   */
  updateProfile(updates: Partial<User>): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      try {
        const currentUser = this.currentUser();
        if (!currentUser) {
          observer.next({ success: false, error: 'No hay usuario autenticado' });
          observer.complete();
          return;
        }
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) {
          observer.next({ success: false, error: 'Usuario no encontrado' });
          observer.complete();
          return;
        }
        const updatedUser = { ...users[userIndex], ...updates };
        users[userIndex] = updatedUser;
        this.saveUsers(users);
        this.setCurrentUser(updatedUser);
        observer.next({ success: true, user: updatedUser });
      } catch (error) {
        observer.next({ success: false, error: 'Error al actualizar perfil' });
      }
      observer.complete();
    });
  }
  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }
  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.userRole();
    return currentRole ? roles.includes(currentRole) : false;
  }
  /**
   * Obtener todos los usuarios
   */
  getAllUsers(): User[] {
    try {
      const usersData = localStorage.getItem(this.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }
  /**
   * Establece el usuario actual y actualiza el almacenamiento
   */
  setCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
    this.currentUserSubject.next(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
  /**
   * Obtiene el nombre para mostrar del rol del usuario actual
   */
  getUserRoleDisplayName(): string {
    const role = this.userRole();
    const roleNames: { [key: string]: string } = {
      'admin': 'Administrador',
      'funcionario': 'Funcionario',
      'tecnico': 'Técnico',
      'cliente': 'Cliente'
    };
    return roleNames[role || ''] || role || '';
  }
  /**
   * Limpia la sesión del usuario
   */
  private clearSession(): void {
    this.currentUserSignal.set(null);
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }
  /**
   * Guarda el array de usuarios en localStorage
   */
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
  /**
   * Genera un ID de usuario único
   */
  private generateUserId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 9);
    return `user_${timestamp}_${random}`;
  }
}
