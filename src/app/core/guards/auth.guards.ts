import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
/**
 * Guard para proteger rutas que requieren autenticación
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
/**
 * Guard para redirigir usuarios autenticados lejos de páginas de autenticación
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};
/**
 * Guard para proteger rutas solo para administradores
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
/**
 * Guard para proteger rutas para roles de funcionario y administrador
 */
export const funcionarioGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && 
      authService.hasAnyRole(['admin', 'funcionario'])) {
    return true;
  }
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
/**
 * Guard para proteger rutas para roles de técnico, funcionario y administrador
 */
export const tecnicoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && 
      authService.hasAnyRole(['admin', 'funcionario', 'tecnico'])) {
    return true;
  }
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
