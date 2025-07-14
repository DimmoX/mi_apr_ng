import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataInitService } from '../../core/services/data-init.service';
import { WaterReading, User, WaterMeter } from '../../core/models/user.model';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ActionButtonComponent } from '../../components/action-button/action-button.component';
@Component({
  selector: 'app-readings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTooltipModule,
    PageHeaderComponent,
    ActionButtonComponent
  ],
  templateUrl: './readings.component.html',
  styleUrl: './readings.component.scss'
})
export class ReadingsComponent implements OnInit {
  currentUser = this.authService.currentUser;
  userRole = this.authService.userRole;
  readings = signal<WaterReading[]>([]);
  clients = signal<User[]>([]);
  meters = signal<WaterMeter[]>([]);
  selectedClientMeters = signal<WaterMeter[]>([]);
  isLoading = signal(false);
  readingForm: FormGroup;
  get displayedColumns(): string[] {
    const role = this.userRole();
    if (role === 'cliente') {
      return ['fechaLectura', 'idMedidor', 'lecturaAnterior', 'lecturaActual', 'consumo', 'observaciones', 'estado'];
    } else {
      return ['fechaLectura', 'usuario', 'idMedidor', 'lecturaAnterior', 'lecturaActual', 'consumo', 'observaciones', 'estado'];
    }
  }
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dataInitService: DataInitService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.readingForm = this.createForm();
  }
  ngOnInit(): void {
    this.loadReadings();
    this.loadClients();
    this.loadMeters();
    this.setupFormForRole();
  }
  private createForm(): FormGroup {
    const role = this.userRole();
    if (role === 'cliente') {
      // Para clientes, solo necesitan fecha y lectura actual
      return this.fb.group({
        date: [new Date(), [Validators.required]],
        currentReading: ['', [Validators.required, Validators.min(0)]]
      });
    } else {
      // Para personal, necesitan seleccionar cliente y medidor
      return this.fb.group({
        date: [new Date(), [Validators.required]],
        clientId: ['', [Validators.required]],
        meterId: ['', [Validators.required]],
        currentReading: ['', [Validators.required, Validators.min(0)]]
      });
    }
  }

  // Método para configurar el formulario según el rol del usuario
  private setupFormForRole(): void {
    const role = this.userRole();
    if (role === 'cliente') {
      this.readingForm.disable();
    } else {
      // Configurar listeners para el formulario del personal
      this.setupClientMeterListener();
    }
  }

  // Método para configurar el listener de cambios en el cliente seleccionado
  private setupClientMeterListener(): void {
    // Escuchar cambios en la selección de cliente para actualizar medidores
    this.readingForm.get('clientId')?.valueChanges.subscribe(clientId => {
      if (clientId) {
        const clientMeters = this.dataInitService.getUserMeters(clientId);
        this.selectedClientMeters.set(clientMeters);
        // Limpiar selección de medidor cuando cambia el cliente
        this.readingForm.get('meterId')?.setValue('');
      } else {
        this.selectedClientMeters.set([]);
      }
    });
  }

  // Método para verificar si el diálogo de solicitud de medidor debe abrirse automáticamente
  private loadReadings(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      const user = this.currentUser();
      const role = this.userRole();
      if (role === 'cliente' && user) {
        const userReadings = this.dataInitService.getUserReadings(user.id);
        this.readings.set(userReadings);
      } else {
        const allReadings = this.dataInitService.getReadings();
        this.readings.set(allReadings);
      }
      this.isLoading.set(false);
    }, 500);
  }

  // Método para cargar los clientes disponibles
  private loadClients(): void {
    const role = this.userRole();
    if (role !== 'cliente') {
      const clientUsers = this.dataInitService.getClientUsers();
      this.clients.set(clientUsers);
    }
  }

  // Método para cargar los medidores disponibles
  private loadMeters(): void {
    const allMeters = this.dataInitService.getMeters();
    this.meters.set(allMeters);
  }
  onSubmit(): void {
    if (this.readingForm.invalid) {
      return;
    }

    const role = this.userRole();
    const formData = this.readingForm.value;
    let targetUserId: string | number;
    let meterId: string;

    if (role === 'cliente') {
      // Para clientes, usar sus propios datos
      const user = this.currentUser();
      if (!user) return;
      targetUserId = user.id;
      meterId = `MED-${user.id}`;
    } else {
      // Para personal, usar los datos seleccionados del formulario
      if (!formData.clientId || !formData.meterId) {
        this.snackBar.open('Debe seleccionar cliente y medidor', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      targetUserId = formData.clientId;
      meterId = formData.meterId;
    }

    // Obtener la última lectura del usuario seleccionado
    const userReadings = this.dataInitService.getUserReadings(targetUserId);
    const lastReading = userReadings
      .filter(reading => reading.idMedidor === meterId)
      .sort((a, b) => new Date(b.fechaLectura).getTime() - new Date(a.fechaLectura).getTime())[0];

    const previousReading = lastReading ? lastReading.lecturaActual : 0;
    const consumption = Math.max(0, formData.currentReading - previousReading);

    // Debug: verificar el valor de la fecha
    console.log('FormData.date:', formData.date);
    console.log('Tipo de formData.date:', typeof formData.date);

    const newReading: WaterReading = {
      id: this.generateReadingId(),
      idUsuario: targetUserId,
      idMedidor: meterId,
      fechaLectura: this.formatDateForStorage(formData.date),
      horaLectura: new Date().toTimeString().substring(0, 5),
      lecturaAnterior: previousReading,
      lecturaActual: formData.currentReading,
      consumo: consumption,
      observaciones: role === 'cliente' ? 'Lectura ingresada por usuario' : `Lectura registrada por ${role}`,
      estado: 'completada'
    };

    const allReadings = this.dataInitService.getReadings();
    allReadings.push(newReading);
    localStorage.setItem('apr_readings', JSON.stringify(allReadings));

    this.loadReadings();
    this.snackBar.open('Lectura registrada correctamente', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });

    // Resetear formulario
    this.readingForm.reset();
    this.readingForm.patchValue({ date: new Date() });
    if (role !== 'cliente') {
      this.selectedClientMeters.set([]);
    }
  }

  // Método para generar un ID único para la nueva lectura
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'completada': 'Completada',
      'error': 'Error'
    };
    return statusMap[status] || status;
  }

  // Método para obtener el color del estado de la lectura
  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pendiente': '#ff9800',
      'completada': '#4caf50',
      'error': '#f44336'
    };
    return colorMap[status] || '#666';
  }

  // Método para verificar si el usuario puede agregar lecturas
  canAddReading(): boolean {
    const role = this.userRole();
    return role === 'admin' || role === 'funcionario' || role === 'tecnico';
  }

  // Método para navegar a la página de inicio
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // Método para formatear la fecha en formato DD/MM/YYYY
  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha no disponible';
    
    // Si la fecha ya está en formato DD/MM/YYYY, devolverla tal como está
    if (dateString.includes('/') && dateString.split('/').length === 3) {
      const parts = dateString.split('/');
      if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        return dateString; // Ya está en formato DD/MM/YYYY
      }
    }
    
    // Intentar convertir desde otros formatos
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida para formatear:', dateString);
      return 'Fecha inválida';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Método para formatear la fecha para almacenamiento
  formatDateForStorage(date: Date | string | null): string {
    if (!date) {
      // Si no hay fecha, usar la fecha actual
      const today = new Date();
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      return `${day}/${month}/${year}`;
    }
    
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      console.error('Fecha inválida recibida:', date);
      // Usar fecha actual como fallback
      const today = new Date();
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      return `${day}/${month}/${year}`;
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Método para generar un ID único para la nueva lectura
  getAverageConsumption(): number {
    const userReadings = this.readings();
    if (userReadings.length === 0) return 0;
    const totalConsumption = userReadings.reduce((sum, reading) => sum + reading.consumo, 0);
    return Math.round(totalConsumption / userReadings.length);
  }

  // Método para obtener la última fecha de lectura del usuario
  getLastReadingDate(): string {
    const userReadings = this.readings();
    if (userReadings.length === 0) return 'No disponible';
    const lastReading = userReadings
      .sort((a, b) => new Date(b.fechaLectura).getTime() - new Date(a.fechaLectura).getTime())[0];
    return this.formatDate(lastReading.fechaLectura);
  }

  // Método para generar un ID único para la nueva lectura
  generateReadingId(): number {
    const allReadings = this.dataInitService.getReadings();
    const maxId = allReadings.length > 0 ? Math.max(...allReadings.map(r => r.id)) : 0;
    return maxId + 1;
  }

  // Método para calcular el costo promedio de las lecturas
  getAverageCost(): number {
    const userReadings = this.readings();
    if (userReadings.length === 0) return 0;
    const costPerCubicMeter = 850;
    const totalCost = userReadings.reduce((sum, reading) => sum + (reading.consumo * costPerCubicMeter), 0);
    return totalCost / userReadings.length;
  }

  // Método para formatear la moneda
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  // Método para obtener el nombre del usuario en formato legible
  getUserName(userId: string | number): string {
    const usersData = localStorage.getItem('apr_users');
    if (!usersData) return 'Usuario desconocido';
    const users = JSON.parse(usersData);
    const user = users.find((u: any) => u.id === userId);
    return user ? `${user.name} ${user.lastname}` : 'Usuario desconocido';
  }
  getClientDisplayName(client: User): string {
    return `${client.name} ${client.lastname} (${client.email})`;
  }

  // Método para obtener el nombre del medidor en un formato legible
  getMeterDisplayName(meter: WaterMeter): string {
    return `${meter.id} - ${meter.marca} ${meter.modelo}`;
  }
}
