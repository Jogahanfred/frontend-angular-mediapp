import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Especialidad } from '../_model/especialidad';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService extends GenericService<Especialidad>{

  //variable que almacenara los cambios para enviar a otro componente
  private especialidadCambio : Subject<Especialidad[]> = new Subject<Especialidad[]>();
  //variable para mensaje
  private mensajeCambio : Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient){
    super(
      http,
      `${environment.HOST}/especialidades`
    );
  }

  getEspecialidadCambio(){
    return this.especialidadCambio.asObservable();
  }
  setEspecialidadCambio(lista : Especialidad[]){
    return this.especialidadCambio.next(lista);
  }
  getMensajeCambio(){
   return this.mensajeCambio.asObservable();
 }
 setMensajeCambio(mensaje : string){
   return this.mensajeCambio.next(mensaje);
 }
}
