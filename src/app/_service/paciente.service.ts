import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Paciente } from '../_model/paciente';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class PacienteService extends GenericService<Paciente>{

  //variable que almacenara los cambios para enviar a otro componente
  private pacienteCambio : Subject<Paciente[]> = new Subject<Paciente[]>();
  //variable que almacenara los cambios para enviar a otro componente
  private pacienteRegistrado : Subject<Paciente> = new Subject<Paciente>();
  //variable para mensaje
  private mensajeCambio : Subject<string> = new Subject<string>();

  //`` Estas comillas se utilizan para Concatenacion de variables con texto

  //Esto se utiliza cuando se trabaj sin genericos
  /*url: string = `${environment.HOST}/pacientes`;
  constructor(private http: HttpClient) {}*/

  constructor(protected http: HttpClient){
    super(
      http,
      `${environment.HOST}/pacientes`
    );
  }
  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  listarPorDni(dni: string){
    return this.http.get<Paciente>(`${this.url}/buscarPorDni/${dni}`);
   }

//listar(): Observable<Paciente[]>{--es redundante en lo que devolvera
 /* listar() {
    return this.http.get<Paciente[]>(this.url);
  }
  listarPorId(id : number){
   return this.http.get<Paciente>(`${this.url}/${id}`);
  }
  registrar(paciente : Paciente){
    return this.http.post(this.url,paciente);
  }
  modificar(paciente : Paciente){
    return this.http.put(this.url,paciente);
  }
  eliminar(id : number){
    return this.http.delete(`${this.url}/${id}`);
   }*/

   ///Para poder utilizar las variables que son private como GET AND SET
   //Cuando quieres traerlo se usa el Observable y setearlo el next

   getPacienteCambio(){
     return this.pacienteCambio.asObservable();
   }
   setPacienteCambio(lista : Paciente[]){
     return this.pacienteCambio.next(lista);
   }

   getPacienteRegistrado(){
    return this.pacienteRegistrado.asObservable();
  }
  setPacienteRegistrado(paciente : Paciente){
    return this.pacienteRegistrado.next(paciente);
  }

   getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }
  setMensajeCambio(mensaje : string){
    return this.mensajeCambio.next(mensaje);
  }
}
