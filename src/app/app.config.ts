import { ApplicationConfig, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-CL';
import { DataInitService } from './core/services/data-init.service';

// Registrar locale español chileno
registerLocaleData(localeEs);

// Formato de fechas personalizado para DD/MM/YYYY
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// Función para inicializar el servicio de datos al arrancar la app
export function initializeDataService(dataService: DataInitService): () => void {
  return () => {
    console.log('🚀 Mi APR: Inicializando servicio de datos desde APP_INITIALIZER');
  };
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es-CL' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeDataService,
      deps: [DataInitService],
      multi: true
    }
  ]
};
