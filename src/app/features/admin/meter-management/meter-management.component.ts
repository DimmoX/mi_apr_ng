import { Component, OnInit, signal, computed, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { AuthService } from '../../../core/services/auth.service';
import { MeterManagementService } from '../../../core/services/meter-management.service';
import { DataInitService } from '../../../core/services/data-init.service';
import { MeterRequest, WaterMeter } from '../../../core/models/user.model';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';

@Component({
  selector: 'app-approve-meter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Aprobar Solicitud de Medidor</h2>
    <mat-dialog-content>
      <div class="request-details">
        <h3>Datos de la Solicitud</h3>
        <div class="detail-row">
          <strong>Usuario:</strong> {{ getUserName(request.idUsuario) }}
        </div>
        <div class="detail-row">
          <strong>Marca:</strong> {{ request.marca }}
        </div>
        <div class="detail-row">
          <strong>Modelo:</strong> {{ request.modelo }}
        </div>
        <div class="detail-row">
          <strong>N° Serie:</strong> {{ request.numeroSerie }}
        </div>
        <div class="detail-row">
          <strong>Ubicación:</strong> {{ request.ubicacion }}
        </div>
        <div class="detail-row" *ngIf="request.observaciones">
          <strong>Observaciones:</strong> {{ request.observaciones }}
        </div>
      </div>
      
      <form [formGroup]="approvalForm" class="approval-form">
        <h3>Datos de Instalación</h3>
        
        <mat-form-field appearance="outline">
          <mat-label>Fecha de Instalación</mat-label>
          <input matInput type="date" formControlName="fechaInstalacion">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Coordenadas (opcional)</mat-label>
          <input matInput formControlName="coordenadas" 
                 placeholder="ej: -33.4489, -70.6693">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Observaciones de Instalación</mat-label>
          <textarea matInput formControlName="observacionesInstalacion" 
                    placeholder="Notas sobre la instalación del medidor"
                    rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="approvalForm.invalid"
              (click)="approveRequest()">
        <mat-icon>check</mat-icon>
        Aprobar e Instalar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .request-details {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .detail-row {
      margin-bottom: 8px;
    }
    .approval-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }
  `]
})
/**
 * Componente para aprobar solicitudes de medidores de agua.
 * Permite ingresar datos de instalación y confirmar la aprobación.
 * Utiliza Reactive Forms para la validación de datos.
 * @example
 * ```typescript
 * constructor(private meterService: MeterManagementService) {}
 * // Abrir diálogo de aprobación
 * this.dialog.open(ApproveMeterDialogComponent, {
 *   data: request // Solicitud de medidor a aprobar
 * });
 * ```
 */
export class ApproveMeterDialogComponent {
  approvalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private meterService: MeterManagementService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ApproveMeterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public request: MeterRequest
  ) {
    this.approvalForm = this.fb.group({
      fechaInstalacion: [new Date().toISOString().split('T')[0], [Validators.required]],
      coordenadas: [''],
      observacionesInstalacion: ['']
    });
  }

  approveRequest(): void {
    if (this.approvalForm.valid) {
      const user = this.authService.currentUser();
      if (user) {
        const meterData = {
          fechaInstalacion: this.approvalForm.value.fechaInstalacion,
          coordenadas: this.approvalForm.value.coordenadas,
          observaciones: this.approvalForm.value.observacionesInstalacion
        };
        
        this.meterService.approveMeterRequest(
          this.request.id, 
          user.name + ' ' + user.lastname, 
          meterData
        );
        
        this.snackBar.open('Solicitud aprobada y medidor instalado', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Cerrar el diálogo con un resultado que indique éxito
        this.dialogRef.close({ success: true, action: 'approved' });
      }
    }
  }

  /**
   * Obtener nombre del usuario por ID
   */
  getUserName(userId: string | number): string {
    const users = JSON.parse(localStorage.getItem('apr_users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    return user ? `${user.name} ${user.lastname}` : `ID: ${userId}`;
  }
}

@Component({
  selector: 'app-reject-meter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Rechazar Solicitud de Medidor</h2>
    <mat-dialog-content>
      <div class="request-details">
        <div class="detail-row">
          <strong>Usuario:</strong> {{ getUserName(request.idUsuario) }}
        </div>
        <div class="detail-row">
          <strong>Medidor:</strong> {{ request.marca }} {{ request.modelo }}
        </div>
        <div class="detail-row">
          <strong>N° Serie:</strong> {{ request.numeroSerie }}
        </div>
      </div>
      
      <form [formGroup]="rejectionForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Motivo del Rechazo</mat-label>
          <textarea matInput formControlName="motivoRechazo" 
                    placeholder="Explique por qué se rechaza esta solicitud"
                    rows="4"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="warn" 
              [disabled]="rejectionForm.invalid"
              (click)="rejectRequest()">
        <mat-icon>close</mat-icon>
        Rechazar Solicitud
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .request-details {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .detail-row {
      margin-bottom: 8px;
    }
    .full-width {
      width: 100%;
      min-width: 400px;
    }
  `]
})
export class RejectMeterDialogComponent {
  rejectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private meterService: MeterManagementService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RejectMeterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public request: MeterRequest
  ) {
    this.rejectionForm = this.fb.group({
      motivoRechazo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  rejectRequest(): void {
    if (this.rejectionForm.valid) {
      const user = this.authService.currentUser();
      if (user) {
        this.meterService.rejectMeterRequest(
          this.request.id, 
          user.name + ' ' + user.lastname,
          this.rejectionForm.value.motivoRechazo
        );
        
        this.snackBar.open('Solicitud rechazada', 'Cerrar', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
        
        // Cerrar el diálogo con un resultado que indique éxito
        this.dialogRef.close({ success: true, action: 'rejected' });
      }
    }
  }

  /**
   * Obtener nombre del usuario por ID
   */
  getUserName(userId: string | number): string {
    const users = JSON.parse(localStorage.getItem('apr_users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    return user ? `${user.name} ${user.lastname}` : `ID: ${userId}`;
  }
}

@Component({
  selector: 'app-meter-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatChipsModule,
    PageHeaderComponent
  ],
  templateUrl: './meter-management.component.html',
  styleUrl: './meter-management.component.scss'
})
export class MeterManagementComponent implements OnInit {
  currentUser = this.authService.currentUser;
  
  // Signals para las solicitudes
  allRequests = this.meterService.meterRequests;
  pendingRequests = computed(() => 
    this.allRequests().filter(request => request.estado === 'pendiente')
  );
  processedRequests = computed(() => 
    this.allRequests().filter(request => request.estado !== 'pendiente')
  );
  
  // Configuración de tablas
  pendingColumns = ['fechaSolicitud', 'usuario', 'medidor', 'ubicacion', 'acciones'];
  processedColumns = ['fechaSolicitud', 'usuario', 'medidor', 'estado', 'fechaRespuesta', 'respuestaPor'];

  // Estadísticas
  stats = computed(() => this.meterService.getRequestStats());

  constructor(
    private authService: AuthService,
    private meterService: MeterManagementService,
    private dialog: MatDialog,
    private router: Router,
    private dataInitService: DataInitService
  ) {}

  ngOnInit(): void {
    // Cargar datos iniciales si es necesario
  }

  /**
   * Abrir diálogo para aprobar solicitud
   */
  openApprovalDialog(request: MeterRequest): void {
    console.log('🎯 Abriendo diálogo de aprobación para:', request.id);
    const dialogRef = this.dialog.open(ApproveMeterDialogComponent, {
      width: '600px',
      data: request
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('🔄 Diálogo cerrado con resultado:', result);
      if (result && result.success) {
        console.log('✅ Solicitud aprobada exitosamente');
        console.log('📊 Solicitudes pendientes después de aprobar:', this.pendingRequests().length);
        // Los signals deberían actualizarse automáticamente
        // ya que el servicio actualiza el signal cuando modifica los datos
      }
    });
  }

  /**
   * Abrir diálogo para rechazar solicitud
   */
  openRejectionDialog(request: MeterRequest): void {
    console.log('🎯 Abriendo diálogo de rechazo para:', request.id);
    const dialogRef = this.dialog.open(RejectMeterDialogComponent, {
      width: '500px',
      data: request
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('🔄 Diálogo cerrado con resultado:', result);
      if (result && result.success) {
        console.log('✅ Solicitud rechazada exitosamente');
        console.log('📊 Solicitudes pendientes después de rechazar:', this.pendingRequests().length);
        // Los signals deberían actualizarse automáticamente
        // ya que el servicio actualiza el signal cuando modifica los datos
      }
    });
  }

  /**
   * Obtener color del chip según el estado
   */
  getStatusChipColor(status: string): string {
    switch (status) {
      case 'pendiente': return 'accent';
      case 'aprobada': return 'primary';
      case 'rechazada': return 'warn';
      default: return '';
    }
  }

  /**
   * Obtener texto del estado
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'aprobada': return 'Aprobada';
      case 'rechazada': return 'Rechazada';
      default: return status;
    }
  }

  /**
   * Formatear fecha para mostrar
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CL');
  }

  /**
   * Obtener nombre del usuario por ID
   */
  getUserName(userId: string | number): string {
    const users = JSON.parse(localStorage.getItem('apr_users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    return user ? `${user.name} ${user.lastname}` : `ID: ${userId}`;
  }

  /**
   * Navegar de vuelta al dashboard
   */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
