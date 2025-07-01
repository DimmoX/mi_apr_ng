import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { AuthService } from './auth.service';

/**
 * Servicio para gestión de usuarios del sistema Mi APR
 * 
 * Proporciona funcionalidades CRUD para usuarios, incluyendo:
 * - Creación, actualización y eliminación de usuarios
 * - Validación de permisos y roles
 * - Gestión de datos persistentes en localStorage
 * 
 * @example
 * ```typescript
 * constructor(private userService: UserManagementService) {}
 * 
 * // Obtener todos los usuarios (solo admin)
 * this.userService.getAllUsers().subscribe(result => {
 *   if (result.success) {
 *     console.log(result.users);
 *   }
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  /** Clave para almacenar usuarios en localStorage */
  private readonly USERS_KEY = 'apr_users';

  /**
   * Constructor del servicio de gestión de usuarios
   * @param authService - Servicio de autenticación para validar permisos
   */
  constructor(private authService: AuthService) {}

  /**
   * Obtiene todos los usuarios del sistema (solo para administradores)
   * @returns Observable con el resultado de la operación
   * @throws Error si el usuario no tiene permisos de administrador
   */
  getAllUsers(): Observable<{ success: boolean; users?: User[]; error?: string }> {
    return new Observable(observer => {
      try {
        if (!this.authService.isAdmin()) {
          observer.next({ success: false, error: 'Acceso denegado' });
          observer.complete();
          return;
        }
        const users = this.loadUsers();
        observer.next({ success: true, users });
      } catch (error) {
        observer.next({ success: false, error: 'Error al cargar usuarios' });
      }
      observer.complete();
    });
  }
  /**
   * Create a new user (admin only)
   */
  createUser(userData: Omit<User, 'id' | 'createdAt'>): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      try {
        if (!this.authService.isAdmin()) {
          observer.next({ success: false, error: 'Acceso denegado' });
          observer.complete();
          return;
        }
        const users = this.loadUsers();
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
        observer.next({ success: true, user: newUser });
      } catch (error) {
        observer.next({ success: false, error: 'Error al crear usuario' });
      }
      observer.complete();
    });
  }
  /**
   * Update an existing user (admin only)
   */
  updateUser(userId: string | number, updates: Partial<User>): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      try {
        if (!this.authService.isAdmin()) {
          observer.next({ success: false, error: 'Acceso denegado' });
          observer.complete();
          return;
        }
        const users = this.loadUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          observer.next({ success: false, error: 'Usuario no encontrado' });
          observer.complete();
          return;
        }
        if (updates.email && updates.email !== users[userIndex].email) {
          const emailExists = users.some(u => 
            u.id !== userId && u.email.toLowerCase() === updates.email!.toLowerCase()
          );
          if (emailExists) {
            observer.next({ success: false, error: 'El email ya está registrado' });
            observer.complete();
            return;
          }
        }
        const { id, createdAt, ...allowedUpdates } = updates;
        const updatedUser = { ...users[userIndex], ...allowedUpdates };
        users[userIndex] = updatedUser;
        this.saveUsers(users);
        const currentUser = this.authService.currentUser();
        if (currentUser && currentUser.id === userId) {
          this.authService.updateProfile(allowedUpdates);
        }
        observer.next({ success: true, user: updatedUser });
      } catch (error) {
        observer.next({ success: false, error: 'Error al actualizar usuario' });
      }
      observer.complete();
    });
  }
  /**
   * Delete a user (admin only)
   */
  deleteUser(userId: string | number): Observable<{ success: boolean; error?: string }> {
    return new Observable(observer => {
      try {
        if (!this.authService.isAdmin()) {
          observer.next({ success: false, error: 'Acceso denegado' });
          observer.complete();
          return;
        }
        const currentUser = this.authService.currentUser();
        if (currentUser && currentUser.id === userId) {
          observer.next({ success: false, error: 'No puedes eliminar tu propia cuenta' });
          observer.complete();
          return;
        }
        const users = this.loadUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          observer.next({ success: false, error: 'Usuario no encontrado' });
          observer.complete();
          return;
        }
        users.splice(userIndex, 1);
        this.saveUsers(users);
        observer.next({ success: true });
      } catch (error) {
        observer.next({ success: false, error: 'Error al eliminar usuario' });
      }
      observer.complete();
    });
  }
  /**
   * Get user by ID
   */
  getUserById(userId: string | number): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      try {
        const users = this.loadUsers();
        const user = users.find(u => u.id === userId);
        if (!user) {
          observer.next({ success: false, error: 'Usuario no encontrado' });
          observer.complete();
          return;
        }
        observer.next({ success: true, user });
      } catch (error) {
        observer.next({ success: false, error: 'Error al buscar usuario' });
      }
      observer.complete();
    });
  }
  /**
   * Get users by role
   */
  getUsersByRole(role: UserRole): Observable<{ success: boolean; users?: User[]; error?: string }> {
    return new Observable(observer => {
      try {
        if (!this.authService.hasAnyRole(['admin', 'funcionario'])) {
          observer.next({ success: false, error: 'Acceso denegado' });
          observer.complete();
          return;
        }
        const users = this.loadUsers();
        const filteredUsers = users.filter(u => u.role === role);
        observer.next({ success: true, users: filteredUsers });
      } catch (error) {
        observer.next({ success: false, error: 'Error al filtrar usuarios' });
      }
      observer.complete();
    });
  }
  /**
   * Search users by name or email
   */
  searchUsers(query: string): Observable<{ success: boolean; users?: User[]; error?: string }> {
    return new Observable(observer => {
      try {
        if (!this.authService.hasAnyRole(['admin', 'funcionario'])) {
          observer.next({ success: false, error: 'Acceso denegado' });
          observer.complete();
          return;
        }
        const users = this.loadUsers();
        const searchQuery = query.toLowerCase().trim();
        const filteredUsers = users.filter(u => 
          u.name.toLowerCase().includes(searchQuery) ||
          u.lastname.toLowerCase().includes(searchQuery) ||
          u.email.toLowerCase().includes(searchQuery) ||
          `${u.name} ${u.lastname}`.toLowerCase().includes(searchQuery)
        );
        observer.next({ success: true, users: filteredUsers });
      } catch (error) {
        observer.next({ success: false, error: 'Error en la búsqueda' });
      }
      observer.complete();
    });
  }
  /**
   * Debug method to check users in localStorage
   */
  checkUsers(): void {
    const users = this.loadUsers();
    console.log('👥 Users in localStorage:', users);
    console.log('📧 User emails:', users.map(u => u.email));
  }
  /**
   * Find user by email for password recovery (no auth required)
   */
  findUserByEmail(email: string): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      try {
        const users = this.loadUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          observer.next({ success: true, user });
        } else {
          observer.next({ success: false, error: 'Usuario no encontrado' });
        }
      } catch (error) {
        observer.next({ success: false, error: 'Error al buscar usuario' });
      }
      observer.complete();
    });
  }
  /**
   * Load users from localStorage
   */
  private loadUsers(): User[] {
    try {
      const usersData = localStorage.getItem(this.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }
  /**
   * Save users to localStorage
   */
  private saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw new Error('Error al guardar usuarios');
    }
  }
  /**
   * Generate unique user ID
   */
  private generateUserId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 9);
    return `user_${timestamp}_${random}`;
  }
}
