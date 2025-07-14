import { Injectable } from '@angular/core';
import { User, WaterReading, WaterMeter } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

/**
 * Servicio para inicializar datos de prueba del sistema APR
 *
 * Este servicio carga usuarios, lecturas y medidores desde URLs externas 
 * y los almacena en localStorage para persistencia durante el desarrollo.
 */
@Injectable({
  providedIn: 'root'
})
export class DataInitService {
  private readonly USERS_KEY = 'apr_users';
  private readonly READINGS_KEY = 'apr_readings';
  private readonly METERS_KEY = 'apr_meters';
  private readonly INIT_FLAG_KEY = 'apr_data_initialized';

  // URLs para cargar datos externos
  private readonly USERS_URL = 'https://dimmox.github.io/mi_apr_ng/json_data/users.json';
  private readonly READINGS_URL = 'https://dimmox.github.io/mi_apr_ng/json_data/readings.json';
  private readonly METERS_URL = 'https://dimmox.github.io/mi_apr_ng/json_data/meters.json';

  constructor(private http: HttpClient) {
    this.initializeDataIfNeeded();
    (window as any).aprDataService = this;
  }

  // Método para inicializar datos si no se ha hecho antes
  private initializeDataIfNeeded(): void {
    const isInitialized = localStorage.getItem(this.INIT_FLAG_KEY);
    if (!isInitialized) {
      this.loadExternalData();
    }
  }

  // Método para cargar datos externos y guardarlos en localStorage
  private loadExternalData(): void {
    console.log('🚀 Mi APR: Cargando Información...');
    
    // Cargar todos los datos en paralelo
    forkJoin({
      users: this.http.get<User[]>(this.USERS_URL),
      readings: this.http.get<WaterReading[]>(this.READINGS_URL),
      meters: this.http.get<WaterMeter[]>(this.METERS_URL)
    }).subscribe({
      next: (data) => {
        // Guardar todos los datos en localStorage
        localStorage.setItem(this.USERS_KEY, JSON.stringify(data.users));
        localStorage.setItem(this.READINGS_KEY, JSON.stringify(data.readings));
        localStorage.setItem(this.METERS_KEY, JSON.stringify(data.meters));
        localStorage.setItem(this.INIT_FLAG_KEY, 'true');

        console.log('✅ Mi APR: Datos externos cargados con éxito');
        console.log(`👥 Usuarios cargados: ${data.users.length}`);
        console.log(`📊 Lecturas cargadas: ${data.readings.length}`);
        console.log(`🔧 Medidores cargados: ${data.meters.length}`);
      },
      error: (error) => {
        console.error('❌ Mi APR: Error al cargar datos externos:', error);
      }
    });
  }

  /**
   * Se obtiene el estado de inicialización de los datos
   */
  isDataInitialized(): boolean {
    return localStorage.getItem(this.INIT_FLAG_KEY) === 'true';
  }

  /**
   * Se obtienen todas las lecturas de localStorage
   */
  getReadings(): WaterReading[] {
    const readings = localStorage.getItem(this.READINGS_KEY);
    return readings ? JSON.parse(readings) : [];
  }

  /**
   * Se obtienen las lecturas de un usuario específico
   */
  getUserReadings(userId: string | number): WaterReading[] {
    const allReadings = this.getReadings();
    return allReadings.filter(reading => reading.idUsuario === userId);
  }

  /**
   * Se obtienen todos los medidores de localStorage
   */
  getMeters(): WaterMeter[] {
    const meters = localStorage.getItem(this.METERS_KEY);
    return meters ? JSON.parse(meters) : [];
  }

  /**
   * Se obtienen los medidores de un usuario específico
   */
  getUserMeters(userId: string | number): WaterMeter[] {
    const allMeters = this.getMeters();
    return allMeters.filter(meter => meter.idUsuario === userId);
  }

  /**
   * Se obtienen todos los usuarios de localStorage
   */
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  /**
   * Se obtienen los usuarios de tipo cliente
   */
  getClientUsers(): User[] {
    const allUsers = this.getUsers();
    return allUsers.filter(user => user.role === 'cliente');
  }
}
