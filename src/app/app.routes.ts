import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard, tecnicoGuard } from './core/guards/auth.guards';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/pages/home/home.component').then(c => c.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/pages/about/about.component').then(c => c.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/pages/contact/contact.component').then(c => c.ContactComponent)
      },
      {
        path: 'under-development',
        loadComponent: () => import('./features/pages/under-development/under-development.component').then(c => c.UnderDevelopmentComponent)
      },
      {
        path: 'reports',
        redirectTo: '/under-development',
        pathMatch: 'full'
      },
      {
        path: 'maintenance',
        redirectTo: '/under-development',
        pathMatch: 'full'
      },
      {
        path: 'notifications',
        redirectTo: '/under-development',
        pathMatch: 'full'
      },
      {
        path: 'settings',
        redirectTo: '/under-development',
        pathMatch: 'full'
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
      },
      {
        path: 'forgot-password',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent)
      },
      {
        path: 'readings',
        canActivate: [authGuard],
        loadComponent: () => import('./features/readings/readings.component').then(c => c.ReadingsComponent)
      },
      {
        path: 'my-meters',
        canActivate: [authGuard],
        loadComponent: () => import('./features/meters/my-meters.component').then(c => c.MyMetersComponent)
      },
      {
        path: 'meter-management',
        canActivate: [tecnicoGuard],
        loadComponent: () => import('./features/admin/meter-management/meter-management.component').then(c => c.MeterManagementComponent)
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          {
            path: 'users',
            loadComponent: () => import('./features/admin/user-management/user-management.component').then(c => c.UserManagementComponent)
          },
          {
            path: '',
            redirectTo: 'users',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: '/home' 
  }
];
