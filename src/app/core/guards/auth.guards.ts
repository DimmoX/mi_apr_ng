import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
/**
 * Guard to protect routes that require authentication
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
 * Guard to redirect authenticated users away from auth pages
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
 * Guard to protect admin-only routes
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
 * Guard to protect routes for funcionario and admin roles
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
 * Guard to protect routes for tecnico, funcionario and admin roles
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
