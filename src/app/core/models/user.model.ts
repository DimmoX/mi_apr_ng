/**
 * Esta interfaz representa a un usuario en el sistema.
 */
export interface User {
  id: string | number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  createdAt: string;
}
/**
 * Tipos de roles de usuario en el sistema.
 * Estos roles determinan los permisos y accesos del usuario.
 */
export type UserRole = 'admin' | 'funcionario' | 'tecnico' | 'cliente';

/**
 * Interfaz para el usuario autenticado.
 * Incluye información básica del usuario y su rol.
 */
export interface AuthUser {
  id: string | number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  role: UserRole;
}

/**
 * Interfaz para las credenciales de inicio de sesión.
 * Incluye email y contraseña.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interfaz para los datos de registro de un nuevo usuario.
 * Incluye nombre, apellido, email, teléfono, contraseña y confirmación de contraseña.
 * La contraseña debe cumplir con ciertos criterios de seguridad.
 */
export interface RegisterData {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

/**
 * Interfaz para las credenciales de un usuario autenticado.
 * Incluye el token JWT y los datos del usuario.
 */
export interface WaterReading {
  id: number;
  idUsuario: string | number;
  idMedidor: string;
  fechaLectura: string;
  horaLectura: string;
  lecturaAnterior: number;
  lecturaActual: number;
  consumo: number;
  observaciones?: string;
  estado: 'completada' | 'pendiente' | 'error';
}

/**
 * Interfaz para las solicitudes de medidores de agua.
 * Incluye información del usuario, medidor y estado de la solicitud.
 * Esta interfaz se utiliza para gestionar las solicitudes de instalación o mantenimiento de medidores.
 */
export interface WaterMeter {
  id: string;
  idUsuario: string | number;
  marca: string;
  modelo: string;
  numeroSerie: string;
  fechaInstalacion: string;
  estado: 'activo' | 'inactivo' | 'mantenimiento' | 'pendiente';
  ubicacion?: string;
  coordenadas?: string;
  instaladoPor?: string;
  fechaSolicitud?: string;
  observaciones?: string;
}

/**
 * Interfaz para las solicitudes de medidores de agua.
 * Incluye información del usuario, medidor y estado de la solicitud.
 * Esta interfaz se utiliza para gestionar las solicitudes de instalación o mantenimiento de medidores.
 */
export interface MeterRequest {
  id: string;
  idUsuario: string | number;
  marca: string;
  modelo: string;
  numeroSerie: string;
  ubicacion: string;
  coordenadas?: string;
  observaciones?: string;
  fechaSolicitud: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaRespuesta?: string;
  respuestaPor?: string;
  motivoRechazo?: string;
}

/**
 * Interfaz para el estado de autenticación del usuario.
 * Incluye si el usuario está autenticado, sus datos y estado de carga o error.
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

/**
 * Interfaz para los errores de validación del formulario de usuario.
 * Incluye posibles errores para cada campo del formulario.
 */
export interface UserValidationErrors {
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}
