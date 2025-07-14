import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../../../core/models/user.model';
import { UserManagementService } from '../../../core/services/user-management.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    PageHeaderComponent,
    ActionButtonComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
/**
 * Componente de gestión de usuarios para administradores
 *
 * Este componente permite a los administradores ver, crear y eliminar usuarios.
 * Utiliza un servicio de gestión de usuarios para interactuar con la API.
 * Incluye un diálogo para crear nuevos usuarios con validación de formularios.
 * Muestra una tabla con los usuarios existentes, sus roles y acciones disponibles.
 * Permite la navegación hacia atrás y la visualización de roles con colores específicos.
 */
export class UserManagementComponent implements OnInit {
  users = signal<User[]>([]);
  isLoading = signal(false);
  displayedColumns: string[] = ['name', 'email', 'phone', 'role', 'actions'];
  constructor(
    private userManagementService: UserManagementService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers(): void {
    this.isLoading.set(true);
    this.userManagementService.getAllUsers().subscribe({
      next: (result) => {
        this.isLoading.set(false);
        if (result.success && result.users) {
          this.users.set(result.users);
        } else {
          this.snackBar.open(result.error || 'Error al cargar usuarios', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Error del sistema', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  deleteUser(userId: string | number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userManagementService.deleteUser(userId).subscribe({
        next: (result) => {
          if (result.success) {
            this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadUsers(); 
          } else {
            this.snackBar.open(result.error || 'Error al eliminar usuario', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error del sistema', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'admin': 'Administrador',
      'funcionario': 'Funcionario',
      'tecnico': 'Técnico',
      'cliente': 'Cliente'
    };
    return roleNames[role] || role;
  }
  getRoleColor(role: string): string {
    const roleColors: { [key: string]: string } = {
      'admin': 'primary',
      'funcionario': 'accent',
      'tecnico': 'warn',
      'cliente': ''
    };
    return roleColors[role] || '';
  }
  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(userData => {
      if (userData) {
        this.createUser(userData);
      }
    });
  }
  private createUser(userData: any): void {
    this.userManagementService.createUser(userData).subscribe({
      next: (result) => {
        if (result.success) {
          this.snackBar.open('Usuario creado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadUsers(); 
        } else {
          this.snackBar.open(result.error || 'Error al crear usuario', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Error del sistema al crear usuario', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  isCurrentUser(userId: string | number): boolean {
    const currentUser = this.authService.currentUser();
    return currentUser?.id === userId;
  }
  editUser(user: User): void {
    this.snackBar.open('Funcionalidad de edición pendiente de implementar', 'Cerrar', {
      duration: 3000
    });
  }
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
