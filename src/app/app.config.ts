import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DataInitService } from './core/services/data-init.service';
// Initialize data on app startup
function initializeApp(dataInitService: DataInitService) {
  return () => {
    // The service constructor will handle initialization
    return Promise.resolve();
  };
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [DataInitService],
      multi: true
    }
  ]
};
