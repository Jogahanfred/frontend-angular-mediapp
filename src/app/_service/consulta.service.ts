import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultaListaExamenDTO } from '../_dto/ConsultaListaExamenDTO';
import { ConsultaResumenDTO } from '../_dto/consultaResumenDTO';
import { FiltroConsultaDTO } from '../_dto/FiltroConsultaDTO';
import { ListaExamenDTO } from '../_dto/listaExamenDTO';
import { Consulta } from '../_model/consulta';

//Creamos una interfaz CONSULTADTO para usarlo como plantilla de la estructura que se desea
/*interface ConsultaListaExamenDTO{
    consulta: Consulta;
    lstExamen: Examen[];
}*/

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  //En este service no se puede apoyar del generico, ya que se utilizan mas de un objeto
  private url: string = `${environment.HOST}/consultas`;

  constructor(private http: HttpClient) {}

  registrarTransaccion(consultaDTO: ConsultaListaExamenDTO) {
    return this.http.post(this.url, consultaDTO);
  }

  buscarOtros(filtroConsulta: FiltroConsultaDTO){
    return this.http.post<Consulta[]>(`${this.url}/buscar/otros`,filtroConsulta);
  }

  buscarFecha(fecha: string){
    return this.http.get<Consulta[]>(`${this.url}/buscar?fecha=${fecha}`);
  }

  listarExamenPorConsulta(idConsulta: number){
    return this.http.get<ListaExamenDTO[]>(`${environment.HOST}/consultaexamenes/${idConsulta}`);
  }

  listarResumen(){
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`);
  }

  generarReporte(){
    //blob arreglo de byte asumirmos el tipode respuesta , ya que por defecto es JSON
    return this.http.get(`${this.url}/generarReporte`,{responseType: 'blob'});
  }

  guardarArchivo(data: File){ //medico: Medico
    let formdata: FormData = new FormData();
    formdata.append('adjunto', data);
    //const medicoBlob = new Blob([JSON.stringify(medico)], { type: "application/json" });
    //formdata.append('medico', medicoBlob)

    return this.http.post(`${this.url}/guardarArchivo`, formdata);
  }

  leerArchivo() {
    return this.http.get(`${this.url}/leerArchivo/6`, {
      responseType: 'blob'
    });
  }

}

