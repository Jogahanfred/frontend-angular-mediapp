import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Signo } from '../_model/signo'

@Injectable({
  providedIn: 'root'
})
export class SignoService extends GenericService<Signo> {


  private signoCambio = new Subject<Signo[]>();

  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`
    );
  }
  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getSignoCambio() {
    return this.signoCambio.asObservable();
  }

  setSignoCambio(signos: Signo[]) {
    this.signoCambio.next(signos);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    return this.mensajeCambio.next(mensaje);
  }
}
