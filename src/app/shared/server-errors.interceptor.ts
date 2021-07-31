import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { tap, catchError, retry, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from '../_service/login.service';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorsInterceptor implements HttpInterceptor {
  private url: string = `${environment.HOST}/oauth/token`;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService,
    private http: HttpClient
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(retry(environment.REINTENTOS))
      .pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            if (
              event.body &&
              event.body.error === true &&
              event.body.errorMessage
            ) {
              throw new Error(event.body.errorMessage);
            } /*else{
                  this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });
              }*/
          }
          //variable err tiene el response json del backend
        })
      )
      .pipe(
        catchError((err) => {
          //https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
          const credencialesIncorrectas: string ="invalid_grant";
          if (err.status === 400) {
            if(err.error.error == credencialesIncorrectas){
              this.snackBar.open("Credenciales Incorrectas", 'AVISO', {
                duration: 5000,
              });
            }else{
              this.snackBar.open(err.error.mensaje, 'ERROR 400', {
                duration: 5000,
              });
            }
          } else if (err.status === 404) {
            this.snackBar.open('No existe el recurso', 'ERROR 404', {
              duration: 5000,
            });
          } else if (err.status === 401) {
            this.snackBar.open('Sesion Expirada', 'ERROR 401', {
              duration: 5000,
            });
            sessionStorage.clear();
            this.router.navigate(['/login']);
          } else if (err.status === 403) {
            console.log(err);
            this.snackBar.open(err.error.error_description, 'ERROR 403', {
              duration: 5000,
            });
            //sessionStorage.clear();
            //this.router.navigate(['/login']);
          } else if (err.status === 500) {
            this.snackBar.open(err.error.mensaje, 'ERROR 500', {
              duration: 5000,
            });
          } else {
            this.snackBar.open(err.error.mensaje, 'ERROR', {
              duration: 5000,
            });
          }

          return EMPTY;
        })
      );
  }
}
