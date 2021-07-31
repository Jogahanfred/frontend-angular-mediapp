import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/_service/login.service';
import { environment } from 'src/environments/environment';
import '../../../assets/login-animation.js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
//variables
  usuario: string;
  clave: string;
  mensaje: string;
  error: string;
  private url: string = `${environment.HOST}/oauth/token`

  constructor(
    private loginService : LoginService,
    //NAVEGACION
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    if (!token == null ){
      this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {
        sessionStorage.clear();
      });
    }
  }

  iniciarSesion(){
    this.loginService.cerrarSesion();
    //mando usuario y clave y recibo la info
    this.loginService.login(this.usuario,this.clave).subscribe(data =>{
      //Luego que tenemos el TOKEN, lo almacenamos en el localStorage o sessionStorage que son como el cookie, session se ejecuta mientras esta abierta la pag.
      //con un key : value, ::access_token:: pero este valor lo guardamos en environment--PASAMOS EL TOKEN
      sessionStorage.setItem(environment.TOKEN_NAME ,data.access_token);
      //UNA VES LOGEADO NAVEGAMOS A INICIO
      this.router.navigate(['pages/inicio']);
    })
   }
  //Al iniciar que que se ejecute el JS, para la animacion de los ojos
  ngAfterViewInit(){
    (window as any).initialize();
  }


}
