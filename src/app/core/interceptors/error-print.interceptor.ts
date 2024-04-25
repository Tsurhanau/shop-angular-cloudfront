import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from '../notification.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: unknown) => {
        let errorMsg = '';
        if (error instanceof HttpErrorResponse) {
          if (error.status === 403) {
            errorMsg = 'Access is denied!';
          } else if (error.status === 401) {
            errorMsg = 'Authorization header is not provided!';
          } else {
            errorMsg = `Request to "${request.url}" failed. Check the console for the details`;
          }
        } else if (error instanceof ErrorEvent) {
          errorMsg = `An error occurred: ${error.error.message}`;
        }
        this.notificationService.showError(errorMsg, 0);
        return throwError(errorMsg);
      })
    );
  }
}
