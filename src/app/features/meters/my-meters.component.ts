import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../core/services/auth.service';
import { MeterManagementService } from '../../core/services/meter-management.service';
import { DataInitService } from '../../core/services/data-init.service';
import { WaterMeter, MeterRequest } from '../../core/models/user.model';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-meter-request-dialog',
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
    <h2 mat-dialog-title>Solicitar Registro de Medidor</h2>
    <mat-dialog-content>
      <form [formGroup]="requestForm" class="meter-request-form">
        <mat-form-field appearance="outline">
          <mat-label>Marca del Medidor</mat-label>
          <mat-select formControlName="marca">
            <mat-option value="Elster">Elster</mat-option>
            <mat-option value="Sensus">Sensus</mat-option>
            <mat-option value="Itron">Itron</mat-option>
            <mat-option value="Kamstrup">Kamstrup</mat-option>
            <mat-option value="Otra">Otra</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Modelo</mat-label>
          <input matInput formControlName="modelo" placeholder="ej: V100, iPERL">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Número de Serie</mat-label>
          <input matInput formControlName="numeroSerie" placeholder="Número de serie del medidor">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ubicación del Medidor</mat-label>
          <textarea matInput formControlName="ubicacion" 
                    placeholder="Dirección exacta donde se encuentra o instalará el medidor"
                    rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Observaciones (opcional)</mat-label>
          <textarea matInput formControlName="observaciones" 
                    placeholder="Información adicional relevante"
                    rows="2"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="requestForm.invalid"
              (click)="submitRequest()">
        Enviar Solicitud
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .meter-request-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }
  `]
})

/**
 * Componente para solicitar el registro de un medidor de agua.
 * Permite al usuario ingresar detalles del medidor y enviarlos para su registro.
 * Utiliza un formulario reactivo para la validación de los campos.
 * Incluye campos para marca, modelo, número de serie, ubicación y observaciones.
 * El formulario se valida antes de permitir el envío de la solicitud.
 * Utiliza servicios de gestión de medidores y autenticación para procesar la solicitud.
 */
export class MeterRequestDialogComponent {
  requestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private meterService: MeterManagementService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.requestForm = this.fb.group({
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      numeroSerie: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      observaciones: ['']
    });
  }

  submitRequest(): void {
    if (this.requestForm.valid) {
      const user = this.authService.currentUser();
      if (user) {
        const requestData = {
          idUsuario: user.id,
          ...this.requestForm.value
        };
        
        this.meterService.createMeterRequest(requestData);
        this.snackBar.open('Solicitud enviada correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialog.closeAll();
      }
    }
  }
}

@Component({
  selector: 'app-my-meters',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    PageHeaderComponent
  ],
  templateUrl: './my-meters.component.html',
  styleUrl: './my-meters.component.scss'
})
export class MyMetersComponent implements OnInit {
  currentUser = this.authService.currentUser;
  userMeters = signal<WaterMeter[]>([]);
  userRequests = signal<MeterRequest[]>([]);
  displayedColumns = ['numeroSerie', 'marca', 'modelo', 'estado', 'fechaInstalacion'];
  requestColumns = ['fechaSolicitud', 'marca', 'modelo', 'estado', 'fechaRespuesta'];

  constructor(
    private authService: AuthService,
    private meterService: MeterManagementService,
    private dataInitService: DataInitService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.checkAutoOpenDialog();
  }

  // Método para cargar los datos del usuario
  private loadUserData(): void {
    const user = this.currentUser();
    if (user) {
      // Cargar medidores del usuario
      const meters = this.dataInitService.getUserMeters(user.id);
      this.userMeters.set(meters);

      // Cargar solicitudes del usuario
      const requests = this.meterService.getUserMeterRequests(user.id);
      this.userRequests.set(requests);
    }
  }

  private checkAutoOpenDialog(): void {
    const user = this.currentUser();
    // Solo abrir automáticamente si no tiene medidores ni solicitudes (primera vez)
    if (user && this.userMeters().length === 0 && this.userRequests().length === 0) {
      setTimeout(() => {
        this.openMeterRequestDialog();
      }, 500);
    }
  }

  openMeterRequestDialog(): void {
    this.dialog.open(MeterRequestDialogComponent, {
      width: '500px',
      disableClose: false
    }).afterClosed().subscribe(() => {
      this.loadUserData(); // Recargar datos después de cerrar el modal
    });
  }

  /**
   * Verificar si el usuario puede solicitar un nuevo medidor
   * Permite múltiples solicitudes, pero limita las pendientes simultáneas
   */
  canRequestNewMeter(): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return this.meterService.shouldShowMeterRegistration(user.id);
  }

  /**
   * Contar solicitudes pendientes del usuario
   */
  getPendingRequestsCount(): number {
    return this.userRequests().filter(r => r.estado === 'pendiente').length;
  }

  // Método para navegar al dashboard
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // Método para obtener el color del estado del medidor
  getStatusColor(status: string): string {
    switch (status) {
      case 'activo': return 'green';
      case 'pendiente': return 'orange';
      case 'aprobada': return 'green';
      case 'rechazada': return 'red';
      case 'inactivo': return 'gray';
      default: return 'gray';
    }
  }

  // Método para obtener el texto del estado del medidor
  getStatusText(status: string): string {
    switch (status) {
      case 'activo': return 'Activo';
      case 'pendiente': return 'Pendiente';
      case 'aprobada': return 'Aprobada';
      case 'rechazada': return 'Rechazada';
      case 'inactivo': return 'Inactivo';
      default: return status;
    }
  }
}
