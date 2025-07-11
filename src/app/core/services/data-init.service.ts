import { Injectable } from '@angular/core';
import { User, WaterReading, WaterMeter } from '../models/user.model';
/**
 * Servicio para inicializar datos de prueba del sistema APR
 *
 * Este servicio crea usuarios y lecturas de agua de ejemplo para demostrar
 * la funcionalidad del sistema. Los datos se almacenan en localStorage
 * para persistencia durante el desarrollo.
 */
@Injectable({
  providedIn: 'root'
})
export class DataInitService {
  private readonly USERS_KEY = 'apr_users';
  private readonly READINGS_KEY = 'apr_readings';
  private readonly METERS_KEY = 'apr_meters';
  private readonly INIT_FLAG_KEY = 'apr_data_initialized';
  constructor() {
    this.initializeDataIfNeeded();
    (window as any).aprDataService = this;
  }
  private initializeDataIfNeeded(): void {
    const isInitialized = localStorage.getItem(this.INIT_FLAG_KEY);
    if (!isInitialized) {
      this.createInitialUsers();
      this.createInitialReadings();
      this.createInitialMeters();
      localStorage.setItem(this.INIT_FLAG_KEY, 'true');
      console.log('🚀 APR System: Initial data created successfully');
    }
  }
  private createInitialUsers(): void {
    const initialUsers: User[] = [
      {
        id: 'admin_001',
        name: 'Administrador',
        lastname: 'Sistema',
        email: 'admin@apr.cl',
        phone: '+56987654321',
        role: 'admin',
        password: 'admin123',
        createdAt: new Date().toISOString()
      },
      {
        id: 'func_001',
        name: 'Funcionario',
        lastname: 'Sistema',
        email: 'funcionario@apr.cl',
        phone: '+56912345678',
        role: 'funcionario',
        password: 'funcionario123',
        createdAt: new Date().toISOString()
      },
      {
        id: 'tech_001',
        name: 'Técnico',
        lastname: 'Sistema',
        email: 'tecnico@apr.cl',
        phone: '+56923456789',
        role: 'tecnico',
        password: 'tecnico123',
        createdAt: new Date().toISOString()
      },
      {
        id: 'client_001',
        name: 'Cliente 1',
        lastname: 'Sistema',
        email: 'cliente1@apr.cl',
        phone: '+56934567890',
        role: 'cliente',
        password: 'cliente123',
        createdAt: new Date().toISOString()
      },
      {
        id: 'client_002',
        name: 'Cliente 2',
        lastname: 'Sistema',
        email: 'cliente2@apr.cl',
        phone: '+56945678901',
        role: 'cliente',
        password: 'cliente123',
        createdAt: new Date().toISOString()
      },
      {
        id: 'client_003',
        name: 'Cliente 3',
        lastname: 'Sistema',
        email: 'cliente3@apr.cl',
        phone: '+56956789012',
        role: 'cliente',
        password: 'cliente123',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(this.USERS_KEY, JSON.stringify(initialUsers));
  }
  private createInitialReadings(): void {
    const initialReadings: WaterReading[] = [
      {
        id: 1,
        idUsuario: 'client_001',
        idMedidor: 'MED-001',
        fechaLectura: '2025-06-01',
        horaLectura: '08:30',
        lecturaAnterior: 1250,
        lecturaActual: 1285,
        consumo: 35,
        observaciones: 'Lectura normal',
        estado: 'completada'
      },
      {
        id: 2,
        idUsuario: 'client_001',
        idMedidor: 'MED-001',
        fechaLectura: '2025-05-01',
        horaLectura: '09:15',
        lecturaAnterior: 1210,
        lecturaActual: 1250,
        consumo: 40,
        observaciones: 'Consumo dentro del rango normal',
        estado: 'completada'
      },
      {
        id: 3,
        idUsuario: 'client_001',
        idMedidor: 'MED-001',
        fechaLectura: '2025-04-01',
        horaLectura: '10:45',
        lecturaAnterior: 1165,
        lecturaActual: 1210,
        consumo: 45,
        observaciones: 'Ligero aumento en el consumo',
        estado: 'completada'
      },
      {
        id: 4,
        idUsuario: 'client_002',
        idMedidor: 'MED-002',
        fechaLectura: '2025-06-02',
        horaLectura: '14:20',
        lecturaAnterior: 890,
        lecturaActual: 915,
        consumo: 25,
        observaciones: 'Consumo bajo',
        estado: 'completada'
      },
      {
        id: 5,
        idUsuario: 'client_003',
        idMedidor: 'MED-003',
        fechaLectura: '2025-06-03',
        horaLectura: '16:00',
        lecturaAnterior: 2100,
        lecturaActual: 2145,
        consumo: 45,
        observaciones: 'Consumo normal para familia numerosa',
        estado: 'completada'
      },
      {
        id: 6,
        idUsuario: 'client_001',
        idMedidor: 'MED-001',
        fechaLectura: '2025-07-01',
        horaLectura: '08:00',
        lecturaAnterior: 1285,
        lecturaActual: 0,
        consumo: 0,
        observaciones: 'Lectura pendiente',
        estado: 'pendiente'
      },
      {
        id: 7,
        idUsuario: 'client_002',
        idMedidor: 'MED-002',
        fechaLectura: '2025-06-15',
        horaLectura: '11:30',
        lecturaAnterior: 915,
        lecturaActual: 965,
        consumo: 50,
        observaciones: 'Consumo aumentado - revisar posibles fugas',
        estado: 'completada'
      }
    ];
    localStorage.setItem(this.READINGS_KEY, JSON.stringify(initialReadings));
  }
  private createInitialMeters(): void {
    const initialMeters: WaterMeter[] = [
      {
        id: 'MED-001',
        idUsuario: 'client_001',
        marca: 'Elster',
        modelo: 'V100',
        numeroSerie: '123456',
        fechaInstalacion: '2025-01-15',
        estado: 'activo'
      },
      {
        id: 'MED-001B',
        idUsuario: 'client_001',
        marca: 'Sensus',
        modelo: 'iPERL',
        numeroSerie: '123457',
        fechaInstalacion: '2025-01-20',
        estado: 'activo'
      },
      {
        id: 'MED-002',
        idUsuario: 'client_002',
        marca: 'Itron',
        modelo: 'Aquadis+',
        numeroSerie: '654321',
        fechaInstalacion: '2025-02-20',
        estado: 'activo'
      },
      {
        id: 'MED-003',
        idUsuario: 'client_003',
        marca: 'Kamstrup',
        modelo: 'Multical21',
        numeroSerie: '789012',
        fechaInstalacion: '2025-03-10',
        estado: 'activo'
      },
      {
        id: 'MED-003B',
        idUsuario: 'client_003',
        marca: 'Elster',
        modelo: 'V200',
        numeroSerie: '789013',
        fechaInstalacion: '2025-03-15',
        estado: 'activo'
      }
    ];
    localStorage.setItem(this.METERS_KEY, JSON.stringify(initialMeters));
  }
  /**
   * Reset all data (for development/testing purposes)
   */
  resetData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.READINGS_KEY);
    localStorage.removeItem(this.METERS_KEY);
    localStorage.removeItem(this.INIT_FLAG_KEY);
    localStorage.removeItem('apr_current_user');
    this.initializeDataIfNeeded();
    console.log('🔄 APR System: Data reset and reinitialized');
  }
  /**
   * Get current initialization status
   */
  isDataInitialized(): boolean {
    return localStorage.getItem(this.INIT_FLAG_KEY) === 'true';
  }
  /**
   * Get sample login credentials (for development purposes)
   */
  getSampleCredentials(): { [role: string]: { email: string; password: string } } {
    return {
      admin: { email: 'admin@apr.cl', password: 'admin123' },
      funcionario: { email: 'funcionario@apr.cl', password: 'funcionario123' },
      tecnico: { email: 'tecnico@apr.cl', password: 'tecnico123' },
      cliente1: { email: 'cliente1@apr.cl', password: 'cliente123' },
      cliente2: { email: 'cliente2@apr.cl', password: 'cliente123' },
      cliente3: { email: 'cliente3@apr.cl', password: 'cliente123' }
    };
  }
  /**
   * Get all readings from localStorage
   */
  getReadings(): WaterReading[] {
    const readings = localStorage.getItem(this.READINGS_KEY);
    return readings ? JSON.parse(readings) : [];
  }
  /**
   * Get readings for a specific user
   */
  getUserReadings(userId: string | number): WaterReading[] {
    const allReadings = this.getReadings();
    return allReadings.filter(reading => reading.idUsuario === userId);
  }
  /**
   * Get all meters from localStorage
   */
  getMeters(): WaterMeter[] {
    const meters = localStorage.getItem(this.METERS_KEY);
    return meters ? JSON.parse(meters) : [];
  }
  /**
   * Get meters for a specific user
   */
  getUserMeters(userId: string | number): WaterMeter[] {
    const allMeters = this.getMeters();
    return allMeters.filter(meter => meter.idUsuario === userId);
  }
  /**
   * Get all users from localStorage
   */
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }
  /**
   * Get only client users
   */
  getClientUsers(): User[] {
    const allUsers = this.getUsers();
    return allUsers.filter(user => user.role === 'cliente');
  }
  /**
   * Force re-initialization (for development/testing)
   */
  forceReinitialize(): void {
    localStorage.removeItem(this.INIT_FLAG_KEY);
    this.initializeDataIfNeeded();
    console.log('🔄 APR System: Data force reinitialized');
  }
}
