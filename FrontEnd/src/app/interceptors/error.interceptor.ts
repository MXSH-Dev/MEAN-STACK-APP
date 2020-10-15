import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        // alert(error.error.message);
        let errorMsg = 'An unknown error occurred';

        if (error.error.message) {
          errorMsg = error.error.message;
        }
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: errorMsg,
          },
        });
        return throwError(error);
      })
    );
  }
}
