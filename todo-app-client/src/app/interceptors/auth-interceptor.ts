import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const apiPrefix = `${environment.apiUrl}/`;

  // Diğer adresleri ve giriş/kayıt isteklerini değiştirmeden geçir.
  if (
    !request.url.startsWith(apiPrefix) ||
    request.url.startsWith(`${apiPrefix}auth/`)
  ) {
    return next(request);
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getAccessToken();

  // Token varsa isteğe ekle.
  const authorizedRequest = token
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : request;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {

      
     // 401 geldiyse ve token değişmediyse oturumu temizleyip girişe yönlendir.

      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        auth.getAccessToken() === token
      ) {
        auth.logout();

        void router.navigate(['/login'], {
          replaceUrl: true
        });
      }

      return throwError(() => error);
    })
  );
};