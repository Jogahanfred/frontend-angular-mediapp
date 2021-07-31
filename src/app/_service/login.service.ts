import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //URL DE CONEXION Cuando se protege con OAUTH2 se crea un endpoint /oauth/token
  private url: string = `${environment.HOST}/oauth/token`

  constructor(
    //PETICIONES
    private http: HttpClient,
    //RUTEAR ENTRE PAGINAS
    private router: Router
  ) { }

  login(usuario: string, contrasena: string) {
    //console.log('LOGIN')
    //this.cerrarSesion();
    //Recibe usuario y contraseña
    //creamos el body , tipo passwrod y usuario y contraseña
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;
    //Devuelve una estructura ANY ya que no lo estoy representando en una clase en el front
    //ENVIO URL, EL BODY
    return this.http.post<any>(this.url, body, {
      //EL SECRET Y ID
      headers: new HttpHeaders().set('Content-Type',
                                     'application/x-www-form-urlencoded; charset=UTF-8')
                                     //uno el ID y el SECRET
                                .set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
  }

 estaLogueado() {
   let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    //Anulamos el token generado
    if (token) {
      this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {
        sessionStorage.clear();
        this.router.navigate(['login']);
      });
    } else {
      sessionStorage.clear();
      this.router.navigate(['login']);
    }
  }

  //enviamos correo
  enviarCorreo(correo: string) {
    return this.http.post<number>(`${environment.HOST}/login/enviarCorreo`, correo, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  verificarTokenReset(token: string) {
    return this.http.get<number>(`${environment.HOST}/login/restablecer/verificar/${token}`);
  }

  restablecer(token: string, clave: string) {
    return this.http.post(`${environment.HOST}/login/restablecer/${token}`, clave, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }
}
