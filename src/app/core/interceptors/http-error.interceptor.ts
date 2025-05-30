import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error) => {
      let message = 'Ocurrió un error inesperado';

      if (error.status === 0) {
        message = 'Error de red. Verifica tu conexión.';
      } else if (error.status >= 400 && error.status < 500) {
        message = error.error?.message || 'Solicitud incorrecta';
      } else if (error.status >= 500) {
        message = 'Error interno del servidor';
      }

      alertService.show('error', message);

      return throwError(() => error);
    })
  );
};
