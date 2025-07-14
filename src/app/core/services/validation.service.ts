import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
/**
 * Servicio de validación para datos del sistema APR.
 * 
 * Este servicio proporciona métodos para validar números de teléfono, correos electrónicos,
 * contraseñas, nombres y lecturas de medidores de agua. Utiliza expresiones regulares y
 * lógica específica para asegurar que los datos cumplan con los formatos requeridos.
 * 
 * @example
 * ```typescript
 * constructor(private validationService: ValidationService) {}
 * 
 * // Validar un número de teléfono chileno
 * const phoneValidation = this.validationService.validatePhoneNumber('+56912345678');
 * if (!phoneValidation.isValid) {
 *   console.error(phoneValidation.message);
 * }
 * ```
 */
export class ValidationService {
  /**
    * Valida un número de teléfono chileno
   */
  validatePhoneNumber(phone: string): { isValid: boolean; message?: string } {
    if (!phone || phone.trim() === '') {
      return { isValid: false, message: 'El teléfono es requerido' };
    }
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const patterns = [
      /^\+56[9][0-9]{8}$/,    
      /^56[9][0-9]{8}$/,      
      /^[9][0-9]{8}$/,        
      /^09[0-9]{8}$/          
    ];
    const isValid = patterns.some(pattern => pattern.test(cleanPhone));
    if (!isValid) {
      return { 
        isValid: false, 
        message: 'Formato de teléfono inválido. Use +56912345678 o 912345678' 
      };
    }
    return { isValid: true };
  }
  /**
   * Formatea un número de teléfono chileno a un formato estándar
   */
  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (cleanPhone.match(/^09[0-9]{8}$/)) {
      return `+56${cleanPhone.substring(1)}`;
    } else if (cleanPhone.match(/^[9][0-9]{8}$/)) {
      return `+56${cleanPhone}`;
    } else if (cleanPhone.match(/^56[9][0-9]{8}$/)) {
      return `+${cleanPhone}`;
    } else if (cleanPhone.match(/^\+56[9][0-9]{8}$/)) {
      return cleanPhone;
    }
    return phone; 
  }
  /**
   * Validar formato de email
   */
  validateEmail(email: string): { isValid: boolean; message?: string } {
    if (!email || email.trim() === '') {
      return { isValid: false, message: 'El email es requerido' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Formato de email inválido' };
    }
    return { isValid: true };
  }
  /**
   * Validar la fuerza de la contraseña
   */
  validatePassword(password: string): { isValid: boolean; message?: string; strength?: string } {
    if (!password || password.trim() === '') {
      return { isValid: false, message: 'La contraseña es requerida' };
    }
    if (password.length < 8) {
      return { 
        isValid: false, 
        message: 'La contraseña debe tener al menos 8 caracteres',
        strength: 'weak'
      };
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
      .filter(Boolean).length;
    if (criteriaCount < 3) {
      return {
        isValid: false,
        message: 'La contraseña debe contener al menos 3 de los siguientes: mayúsculas, minúsculas, números, caracteres especiales',
        strength: criteriaCount < 2 ? 'weak' : 'medium'
      };
    }
    return { 
      isValid: true, 
      strength: criteriaCount === 4 ? 'strong' : 'medium'
    };
  }
  /**
   * Validar confirmación de contraseña
   */
  validatePasswordConfirmation(password: string, confirmPassword: string): { isValid: boolean; message?: string } {
    if (!confirmPassword || confirmPassword.trim() === '') {
      return { isValid: false, message: 'La confirmación de contraseña es requerida' };
    }
    if (password !== confirmPassword) {
      return { isValid: false, message: 'Las contraseñas no coinciden' };
    }
    return { isValid: true };
  }
  /**
   * Validar nombre (nombre o apellido)
   */
  validateName(name: string, fieldName: string = 'nombre'): { isValid: boolean; message?: string } {
    if (!name || name.trim() === '') {
      return { isValid: false, message: `El ${fieldName} es requerido` };
    }
    if (name.trim().length < 2) {
      return { isValid: false, message: `El ${fieldName} debe tener al menos 2 caracteres` };
    }
    if (name.trim().length > 50) {
      return { isValid: false, message: `El ${fieldName} no puede exceder 50 caracteres` };
    }
    const nameRegex = /^[a-zA-ZáéíóúñÑÁÉÍÓÚ\s-]+$/;
    if (!nameRegex.test(name.trim())) {
      return { isValid: false, message: `El ${fieldName} solo puede contener letras, espacios y guiones` };
    }
    return { isValid: true };
  }
  /**
   * Validar lectura de medidor de agua
   */
  validateWaterReading(current: number, previous: number): { isValid: boolean; message?: string } {
    if (current === null || current === undefined || isNaN(current)) {
      return { isValid: false, message: 'La lectura actual es requerida' };
    }
    if (current < 0) {
      return { isValid: false, message: 'La lectura no puede ser negativa' };
    }
    if (previous !== null && previous !== undefined && !isNaN(previous)) {
      if (current < previous) {
        return { isValid: false, message: 'La lectura actual no puede ser menor a la anterior' };
      }
      const consumption = current - previous;
      if (consumption > 1000) {
        return { 
          isValid: false, 
          message: 'El consumo parece excesivo (>1000 m³). Verifique la lectura' 
        };
      }
    }
    return { isValid: true };
  }
  /**
   * Obtiene la fuerza de la contraseña en un formato legible
   */
  getPasswordStrength(password: string): { level: number; text: string; color: string } {
    const validation = this.validatePassword(password);
    switch (validation.strength) {
      case 'weak':
        return { level: 1, text: 'Débil', color: '#f44336' };
      case 'medium':
        return { level: 2, text: 'Media', color: '#ff9800' };
      case 'strong':
        return { level: 3, text: 'Fuerte', color: '#4caf50' };
      default:
        return { level: 0, text: 'Muy débil', color: '#9e9e9e' };
    }
  }
}
