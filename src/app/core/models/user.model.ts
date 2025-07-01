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
export type UserRole = 'admin' | 'funcionario' | 'tecnico' | 'cliente';
export interface AuthUser {
  id: string | number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  role: UserRole;
}
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface RegisterData {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
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

export interface WaterMeter {
  id: string;
  idUsuario: string | number;
  marca: string;
  modelo: string;
  numeroSerie: string;
  fechaInstalacion: string;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
}
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
export interface UserValidationErrors {
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}
