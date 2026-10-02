import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // withHashLocation: las rutas van despues del "#" (ej: /#/login).
    // GitHub Pages no puede reenviar rutas desconocidas al index.html
    // (da 404 al refrescar), asi que la URL con "#" siempre existe.
    provideRouter(routes, withHashLocation()),
    provideHttpClient()
  ]
};
