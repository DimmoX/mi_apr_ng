import { Injectable, signal } from '@angular/core';
import { MeterRequest, WaterMeter } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para gestionar solicitudes de medidores de agua.
 * 
 * Este servicio permite crear, aprobar, rechazar y consultar solicitudes de medidores,
 * así como verificar el estado de las solicitudes y los medidores asociados a los usuarios.
 * Utiliza localStorage para persistir los datos entre sesiones.
 * 
 * @example
 * ```typescript
 * constructor(private meterManagementService: MeterManagementService) {}
 * 
 * // Crear una nueva solicitud de medidor
 * this.meterManagementService.createMeterRequest({
 *   idUsuario: '123',
 *   marca: 'MarcaX',
 *   modelo: 'ModeloY',
 *   numeroSerie: 'SN123456',
 *   ubicacion: 'Ubicación del medidor',
 *   coordenadas: { lat: -33.456, lng: -70.648 },
 *   observaciones: 'Observaciones adicionales'
 * });
 * ```
 */
export class MeterManagementService {
  private readonly METER_REQUESTS_KEY = 'apr_meter_requests';
  
  // Signal para las solicitudes de medidores
  meterRequests = signal<MeterRequest[]>([]);

  constructor() {
    this.loadMeterRequests();
  }

  /**
   * Cargar solicitudes de medidores desde localStorage
   */
  private loadMeterRequests(): void {
    const requests = localStorage.getItem(this.METER_REQUESTS_KEY);
    if (requests) {
      this.meterRequests.set(JSON.parse(requests));
    }
  }

  /**
   * Método público para recargar las solicitudes desde localStorage
   * Útil para refrescar la vista después de cambios
   */
  refreshMeterRequests(): void {
    this.loadMeterRequests();
  }

  /**
   * Guardar solicitudes en localStorage
   */
  private saveMeterRequests(): void {
    localStorage.setItem(this.METER_REQUESTS_KEY, JSON.stringify(this.meterRequests()));
  }

  /**
   * Crear nueva solicitud de medidor
   */
  createMeterRequest(requestData: Omit<MeterRequest, 'id' | 'fechaSolicitud' | 'estado'>): void {
    const newRequest: MeterRequest = {
      ...requestData,
      id: this.generateRequestId(),
      fechaSolicitud: new Date().toISOString().split('T')[0],
      estado: 'pendiente'
    };

    const currentRequests = this.meterRequests();
    this.meterRequests.set([...currentRequests, newRequest]);
    this.saveMeterRequests();
  }

  /**
   * Obtener solicitudes de un usuario específico
   */
  getUserMeterRequests(userId: string | number): MeterRequest[] {
    return this.meterRequests().filter(request => request.idUsuario === userId);
  }

  /**
   * Verificar si un usuario tiene solicitudes pendientes
   */
  hasUserPendingRequests(userId: string | number): boolean {
    return this.meterRequests().some(
      request => request.idUsuario === userId && request.estado === 'pendiente'
    );
  }

  /**
   * Verificar si un usuario tiene medidores activos
   */
  hasUserActiveMeters(userId: string | number): boolean {
    const metersData = localStorage.getItem('apr_meters');
    if (!metersData) return false;
    
    const meters: WaterMeter[] = JSON.parse(metersData);
    return meters.some(meter => meter.idUsuario === userId && meter.estado === 'activo');
  }

  /**
   * Verificar si un usuario puede solicitar un nuevo medidor
   * Permite solicitar medidores adicionales, pero limita las solicitudes pendientes simultáneas
   */
  shouldShowMeterRegistration(userId: string | number): boolean {
    const pendingRequests = this.getUserMeterRequests(userId).filter(r => r.estado === 'pendiente');
    const maxPendingRequests = 3; // Máximo 3 solicitudes pendientes al mismo tiempo
    
    return pendingRequests.length < maxPendingRequests;
  }

  /**
   * Aprobar solicitud de medidor
   */
  approveMeterRequest(requestId: string, approvedBy: string, meterData: Partial<WaterMeter>): void {
    console.log('🔄 Aprobando solicitud:', requestId);
    const requests = [...this.meterRequests()]; // Crear nueva copia del array
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex !== -1) {
      const request = requests[requestIndex];
      
      // Actualizar solicitud creando un nuevo objeto
      requests[requestIndex] = {
        ...request,
        estado: 'aprobada',
        fechaRespuesta: new Date().toISOString().split('T')[0],
        respuestaPor: approvedBy
      };
      
      // Crear medidor en el sistema
      const newMeter: WaterMeter = {
        id: request.numeroSerie || `MED-${request.idUsuario}`,
        idUsuario: request.idUsuario,
        marca: request.marca,
        modelo: request.modelo,
        numeroSerie: request.numeroSerie,
        fechaInstalacion: new Date().toISOString().split('T')[0],
        estado: 'activo',
        ubicacion: request.ubicacion,
        coordenadas: request.coordenadas,
        instaladoPor: approvedBy,
        observaciones: request.observaciones,
        ...meterData
      };

      // Guardar medidor en localStorage
      const metersData = localStorage.getItem('apr_meters');
      const meters: WaterMeter[] = metersData ? JSON.parse(metersData) : [];
      meters.push(newMeter);
      localStorage.setItem('apr_meters', JSON.stringify(meters));
      console.log('✅ Medidor creado:', newMeter);

      // Actualizar solicitudes con la nueva copia del array
      this.meterRequests.set(requests);
      this.saveMeterRequests();
      console.log('✅ Solicitud aprobada y signal actualizado');
    }
  }

  /**
   * Rechazar solicitud de medidor
   */
  rejectMeterRequest(requestId: string, rejectedBy: string, reason: string): void {
    console.log('🔄 Rechazando solicitud:', requestId);
    const requests = [...this.meterRequests()]; // Crear nueva copia del array
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex !== -1) {
      // Actualizar solicitud creando un nuevo objeto
      requests[requestIndex] = {
        ...requests[requestIndex],
        estado: 'rechazada',
        fechaRespuesta: new Date().toISOString().split('T')[0],
        respuestaPor: rejectedBy,
        motivoRechazo: reason
      };
      
      // Actualizar solicitudes con la nueva copia del array
      this.meterRequests.set(requests);
      this.saveMeterRequests();
      console.log('✅ Solicitud rechazada y signal actualizado');
    }
  }

  /**
   * Obtener todas las solicitudes pendientes
   */
  getPendingRequests(): MeterRequest[] {
    return this.meterRequests().filter(request => request.estado === 'pendiente');
  }

  /**
   * Generar ID único para solicitud
   */
  private generateRequestId(): string {
    return 'REQ-' + Date.now().toString();
  }

  /**
   * Obtener estadísticas de solicitudes
   */
  getRequestStats() {
    const requests = this.meterRequests();
    return {
      total: requests.length,
      pendientes: requests.filter(r => r.estado === 'pendiente').length,
      aprobadas: requests.filter(r => r.estado === 'aprobada').length,
      rechazadas: requests.filter(r => r.estado === 'rechazada').length
    };
  }
}
