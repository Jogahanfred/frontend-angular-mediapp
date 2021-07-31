import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../_model/medico';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService extends GenericService<Medico>{

  //variable que almacenara los cambios para enviar a otro componente
  private medicoCambio : Subject<Medico[]> = new Subject<Medico[]>();
  //variable para mensaje
  private mensajeCambio : Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient){
    super(
      http,
      `${environment.HOST}/medicos`
    );
  }

  getMedicoCambio(){
    return this.medicoCambio.asObservable();
  }
  setMedicoCambio(lista : Medico[]){
    return this.medicoCambio.next(lista);
  }
  getMensajeCambio(){
   return this.mensajeCambio.asObservable();
 }
 setMensajeCambio(mensaje : string){
   return this.mensajeCambio.next(mensaje);
 }
}
