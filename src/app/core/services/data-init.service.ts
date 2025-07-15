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
    console.log('🎯 Mi APR: Inicializando DataInitService...');
    console.log('🌐 Mi APR: URLs configuradas:', {
      users: this.USERS_URL,
      readings: this.READINGS_URL, 
      meters: this.METERS_URL
    });
    
    this.initializeDataIfNeeded();
    
    // Agregar método de debug al window para poder diagnosticar desde consola
    (window as any).aprDataService = this;
    (window as any).aprDebug = {
      checkLocalStorage: () => {
        console.log('💾 Mi APR: Estado del localStorage:');
        console.log('  - Users key exists:', !!localStorage.getItem(this.USERS_KEY));
        console.log('  - Readings key exists:', !!localStorage.getItem(this.READINGS_KEY));
        console.log('  - Meters key exists:', !!localStorage.getItem(this.METERS_KEY));
        console.log('  - Init flag:', localStorage.getItem(this.INIT_FLAG_KEY));
        
        const users = this.getUsers();
        const readings = this.getReadings();
        const meters = this.getMeters();
        
        console.log('  - Users count:', users.length);
        console.log('  - Readings count:', readings.length);
        console.log('  - Meters count:', meters.length);
        
        return { users: users.length, readings: readings.length, meters: meters.length };
      },
      forceReload: () => {
        console.log('🔄 Mi APR: Forzando recarga de datos...');
        localStorage.removeItem(this.INIT_FLAG_KEY);
        localStorage.removeItem(this.USERS_KEY);
        localStorage.removeItem(this.READINGS_KEY);
        localStorage.removeItem(this.METERS_KEY);
        this.initializeDataIfNeeded();
      },
      testUrls: () => {
        console.log('🌐 Mi APR: Probando acceso directo a URLs...');
        this.http.get(this.USERS_URL).subscribe({
          next: (data) => console.log('✅ Users URL OK:', data),
          error: (error) => console.error('❌ Users URL Error:', error)
        });
        this.http.get(this.READINGS_URL).subscribe({
          next: (data) => console.log('✅ Readings URL OK:', data),
          error: (error) => console.error('❌ Readings URL Error:', error)
        });
        this.http.get(this.METERS_URL).subscribe({
          next: (data) => console.log('✅ Meters URL OK:', data),
          error: (error) => console.error('❌ Meters URL Error:', error)
        });
      }
    };
    
    console.log('🛠️ Mi APR: Herramientas de debug disponibles via window.aprDebug');
    console.log('  - window.aprDebug.checkLocalStorage() - Verificar estado del localStorage');
    console.log('  - window.aprDebug.forceReload() - Forzar recarga de datos');
    console.log('  - window.aprDebug.testUrls() - Probar URLs directamente');
  }

  // Método para inicializar datos si no se ha hecho antes
  private initializeDataIfNeeded(): void {
    const isInitialized = localStorage.getItem(this.INIT_FLAG_KEY);
    console.log('🔍 Mi APR: Verificando inicialización. Flag:', isInitialized);
    
    if (!isInitialized) {
      console.log('📥 Mi APR: Datos no inicializados, iniciando carga desde URLs externas...');
      this.loadExternalData();
    } else {
      console.log('✅ Mi APR: Datos ya inicializados. Verificando contenido...');
      // Verificar que realmente existen los datos
      const usersExist = localStorage.getItem(this.USERS_KEY);
      const readingsExist = localStorage.getItem(this.READINGS_KEY);
      const metersExist = localStorage.getItem(this.METERS_KEY);
      
      if (!usersExist || !readingsExist || !metersExist) {
        console.log('⚠️ Mi APR: Datos incompletos detectados, recargando...');
        console.log('Users exist:', !!usersExist, 'Readings exist:', !!readingsExist, 'Meters exist:', !!metersExist);
        localStorage.removeItem(this.INIT_FLAG_KEY);
        this.loadExternalData();
      } else {
        console.log('✅ Mi APR: Todos los datos están presentes en localStorage');
      }
    }
  }

  // Método para cargar datos externos y guardarlos en localStorage
  private loadExternalData(): void {
    console.log('🚀 Mi APR: Iniciando carga de datos externos...');
    console.log('🌐 URLs que se van a cargar:');
    console.log('  - Usuarios:', this.USERS_URL);
    console.log('  - Lecturas:', this.READINGS_URL);
    console.log('  - Medidores:', this.METERS_URL);
    
    // Cargar todos los datos en paralelo
    forkJoin({
      users: this.http.get<User[]>(this.USERS_URL),
      readings: this.http.get<WaterReading[]>(this.READINGS_URL),
      meters: this.http.get<WaterMeter[]>(this.METERS_URL)
    }).subscribe({
      next: (data) => {
        console.log('📦 Mi APR: Datos recibidos exitosamente');
        console.log('  - Usuarios recibidos:', data.users?.length || 0);
        console.log('  - Lecturas recibidas:', data.readings?.length || 0);
        console.log('  - Medidores recibidos:', data.meters?.length || 0);

        // Guardar todos los datos en localStorage
        localStorage.setItem(this.USERS_KEY, JSON.stringify(data.users));
        localStorage.setItem(this.READINGS_KEY, JSON.stringify(data.readings));
        localStorage.setItem(this.METERS_KEY, JSON.stringify(data.meters));
        localStorage.setItem(this.INIT_FLAG_KEY, 'true');

        console.log('💾 Mi APR: Datos guardados en localStorage exitosamente');
        console.log(`👥 Usuarios almacenados: ${data.users.length}`);
        console.log(`📊 Lecturas almacenadas: ${data.readings.length}`);
        console.log(`🔧 Medidores almacenados: ${data.meters.length}`);
        
        // Verificar que se guardaron correctamente
        const savedUsers = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
        console.log('✅ Verificación: Usuarios en localStorage:', savedUsers.length);
      },
      error: (error) => {
        console.error('❌ Mi APR: Error al cargar datos externos:', error);
        console.error('❌ Detalles del error:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
        
        // No establecer el flag de inicialización si hay error
        console.log('⚠️ Mi APR: No se establecerá el flag de inicialización debido al error');
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

  /**
   * Método público para forzar la recarga de datos (útil para debugging)
   */
  public forceReloadData(): void {
    console.log('🔄 Mi APR: Forzando recarga de datos desde URLs externas...');
    localStorage.removeItem(this.INIT_FLAG_KEY);
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.READINGS_KEY);
    localStorage.removeItem(this.METERS_KEY);
    this.initializeDataIfNeeded();
  }

  /**
   * Método para verificar el estado actual de los datos
   */
  public getDataStatus(): { initialized: boolean; users: number; readings: number; meters: number } {
    return {
      initialized: this.isDataInitialized(),
      users: this.getUsers().length,
      readings: this.getReadings().length,
      meters: this.getMeters().length
    };
  }
}
