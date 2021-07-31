import { PasswordValidation } from './match';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { LoginService } from './../../../../_service/login.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  form: FormGroup;
  token: string;
  mensaje: string;
  error: string;
  rpta: number;
  tokenValido: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginService : LoginService
  ) { }


  ngOnInit() {
    this.form = this.fb.group({
      password: [''],
      confirmPassword: ['']
    }, {
      // A LOS DOS CAMPOS QUE ESTAN EN EL HTML APLICAREMOS UN VALIDADOR
      //PasswordValidation VIENE DE LA CLASE MATH.TS
      validator: PasswordValidation.MatchPassword
    });

    this.route.params.subscribe((params : Params) => {
      this.token = params['token'];
      //RECIBIMOS EL TOKEN
      this.loginService.verificarTokenReset(this.token).subscribe(data => {
      // SI ES VALIDO DEVOLVEMOS TRUE O SINO FALSE Y REDIRECCIONAMOS AL LOGIN
        if(data === 1){
          this.tokenValido = true;
        }else{
          this.tokenValido = false;
          setTimeout( () => {
            this.router.navigate(['login']);
          }, 2000)
        }
      });
    })
  }

  //METODO PARA RESTABLECER LA CONTRASEÑA Y REDIRECCIONAMOS AL LOGIN
  onSubmit(){
    let clave: string = this.form.value.confirmPassword;
    this.loginService.restablecer(this.token, clave).subscribe(data => {
      this.mensaje = 'Se cambio la contraseña';

        setTimeout(() => {
          this.router.navigate(['login']);
        }, 2000);
    });
  }

}



