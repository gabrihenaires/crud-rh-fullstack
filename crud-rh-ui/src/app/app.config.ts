// Configuração raiz da aplicação standalone:
// - Router + HttpClient (fetch API) + (opcional) animations.

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    // provideAnimations(), // habilite se estiver usando animações do Angular
  ],
};
