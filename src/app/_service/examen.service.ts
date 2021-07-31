import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Examen } from '../_model/examen';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ExamenService extends GenericService<Examen>{

  //variable que almacenara los cambios para enviar a otro componente
  private examenCambio : Subject<Examen[]> = new Subject<Examen[]>();
  //variable para mensaje
  private mensajeCambio : Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient){
    super(
      http,
      `${environment.HOST}/examenes`
    );
  }

  getExamenCambio(){
    return this.examenCambio.asObservable();
  }
  setExamenCambio(lista : Examen[]){
    return this.examenCambio.next(lista);
  }
  getMensajeCambio(){
   return this.mensajeCambio.asObservable();
 }
 setMensajeCambio(mensaje : string){
   return this.mensajeCambio.next(mensaje);
 }
}
