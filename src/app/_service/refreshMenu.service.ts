import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { DecodedTokenDTO } from '../_dto/decodedTokenDTO';

@Injectable({
  providedIn: 'root',
})
export class RefreshMenuService {
  constructor() {}

  mostrarMenu() {
    //AYUDA PARA OBTENER DATOS DEL ARRAY JWT
    const helper = new JwtHelperService();

    //Obtenemos el token
    let token: string | null = sessionStorage.getItem(environment.TOKEN_NAME);

    //decodificamos el token para sacar informacion
    const decodedToken = helper.decodeToken(token);

    //guardamos el usuario del token a nuestra variable
    let decoded = new DecodedTokenDTO();
    decoded.username = decodedToken.user_name;
    decoded.authorities = decodedToken.authorities;

    return decoded;
  }
}
