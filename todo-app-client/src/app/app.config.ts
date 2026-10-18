import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors  } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

import { authInterceptor } from './interceptors/auth-interceptor'; 



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // bu satır, tarayıcı genelinde hata dinleyicilerini sağlar
    provideRouter(routes), // bu satır, uygulamanın yönlendirme yapılandırmasını sağlar
provideHttpClient(withInterceptors([authInterceptor])),    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
    darkModeSelector: '.app-dark'
      }
    }
    })
  ]
};
