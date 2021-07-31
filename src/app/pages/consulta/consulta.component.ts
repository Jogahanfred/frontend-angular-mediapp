import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Consulta } from 'src/app/_model/consulta';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { Medico } from 'src/app/_model/medico';
import { Paciente } from 'src/app/_model/paciente';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { PacienteService } from 'src/app/_service/paciente.service';
//Importamos la libreria de tercero en el componente que se utilizara
import * as moment from 'moment';
import { ConsultaListaExamenDTO } from 'src/app/_dto/ConsultaListaExamenDTO';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { MenuService } from 'src/app/_service/menu.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
})
export class ConsultaComponent implements OnInit {
  //cuando hay un objeto y al final un $ es un observable
  //Un observable es un objeto que permite observar los eventos emitidos por el subject.
  pacientes$: Observable<Paciente[]>;
  medicos$: Observable<Medico[]>;
  especialidades$: Observable<Especialidad[]>;
  examenes$: Observable<Examen[]>;
  //METODO 1 .- pacientes: Paciente[];

  //Valores primitivos para almacenar el id seleccionado
  //DEL HTML vendra del value [(value)]="idPacienteSeleccionado"
  idPacienteSeleccionado: number;
  idMedicoSeleccionado: number;
  idEspecialidadSeleccionado: number;
  idExamenSeleccionado: number;
  //inicializamos la variable maxFecha con la fecha de hoy
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  diagnostico: string;
  tratamiento: string;

  //Se instancia para poder aplicar el push (Add)
  detalleConsulta: DetalleConsulta[] = [];

  //valor para que recepcione los examenes seleccionados
  examenesSeleccionados: Examen[] = [];

  usuario: string;

  constructor(//inyeccion a servicios
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private snackBar: MatSnackBar,
    private consultaService: ConsultaService,
    private menuService: MenuService,
    private refreshMenu: RefreshMenuService
  ) {}

  ngOnInit(): void {//inicializa las listas llenas
   //guardamos el usuario del token a nuestra variable
   this.usuario = this.refreshMenu.mostrarMenu().username;
   this.menuService.listarPorUsuario(this.usuario).subscribe(data =>{
   //para que refresque las opciones de menu de acuerdo al usuario
   this.menuService.setMenuCambio(data);
    })
    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidades();
    this.listarExamenes();

  }

  //metodo para que se guarde en memoria lo registradi en UI
  agregar() {
    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta(); // DIAGNOSTICO - TRATAMIENTO
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      //AGREGA LA INSTANCIA CON LA INFO AL ARREGLO INSTANCIADO INICIALMEN
      this.detalleConsulta.push(det);//LUEGO LIMPIA LOS INPUT
      this.diagnostico = '';
      this.tratamiento = '';
    }
    //HASTA AQUI TENEMOS DETALLECONSULTA LLENO
  }


  agregarExamen() {
    if (this.idExamenSeleccionado > 0) {//VALIDA QUE VENGA VALOR DE UI
      let cont = 0;
      //RECORREMOS LA LISTA EX..SELEC.. CUANTOS REG TIENE
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        //VALIDA SI YA EXISTE EN LA LISTA HACE UN BREAK Y SALE
        if (examen.idExamen === this.idExamenSeleccionado) {
          cont++;
          break;
        }
      }
      //SI SE REPITE MUESTRA MENSAJE E INICIALIZA LA LISTA DE EXAMEN
      if (cont > 0) {
        let mensaje = 'El examen se encuentra en la Lista';
        this.snackBar.open(mensaje, 'Aviso', { duration: 2000 });
        this.idExamenSeleccionado = 0;
      //SI NO SE REPITE VERIFICA QUE EXISTA EL EXAMEN EN BD
      //Y LUEGO LE HACE UN PUSH A ARRAY examenesSeleccionados
      } else {
        this.examenService
          .listarPorId(this.idExamenSeleccionado)
          .subscribe((data) => {
            this.examenesSeleccionados.push(data);
            this.idExamenSeleccionado = 0;
          });
      }
    }
    //HASTA AQUI TENEMOS EXAMENES SELECCIONADOS LLENO
  }

  aceptar() {
    //Creamos e instanciamos objetos y le pasamos el id de la lista
    let medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;

    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionado;

    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    //EMPEZAMOS A CREAR LA ESTRUCTURA DEL BACKEND
    //Creamos e instanciamos el objeto consulta que es lo que espera el backend
    let consulta = new Consulta();
    consulta.medico = medico;
    consulta.paciente = paciente;
    consulta.especialidad = especialidad;
    consulta.numConsultorio = 'C1';
    //libreria para date
    //moment es una libreria que ayudara en los formatos de fecha
    consulta.fecha = moment(this.fechaSeleccionada).format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    consulta.detalleConsulta = this.detalleConsulta;

    //PUSH PARA PODER HACER LA TRANSACCION QUE ESPERA EL BACKEND
    //la estructura que espera el FRONTEND- Debe tener el mismo nombre del BACKEND
    let dto = new ConsultaListaExamenDTO();
    dto.consulta = consulta;
    dto.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(dto).subscribe(() => {
      this.snackBar.open('Consulta Registrada Correctamente', 'Aviso', {
        duration: 2000,
      });
      //le colocamos el timeout para que el usuario tenga la percepcion que se ha registrado pasado unos segundos
      setTimeout(() => {
         //como no estamos trabajando con formularios entonces tengo que setear los campos una vez registrado
         this.limpiarControles();
      }, 2000)

    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.idMedicoSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);

  }
    //consulta.fecha = this.fechaSeleccionada;-- Guardar fecha en formato ISODate
    /*let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(this.fechaSeleccionada.getTime() - tzoffset)).toISOString();
    console.log(localISOTime);
    consulta.fecha = localISOTime;*/

  //Habilita el boton aceptar, como no estoy trabajando con formularios no puedo validar : con este metodo valido
  //RETORNA TRUE O FALSE
  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 || this.idEspecialidadSeleccionado === 0 || this.idMedicoSeleccionado === 0 || this.idPacienteSeleccionado === 0
    );
  }
  removerDiagnostico(index: number) {
    //metodo para eliminar , se le coloca la posicion
    this.detalleConsulta.splice(index, 1);
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }

  //Primera forma de poder poblar un select atraves de un arreglo de pacientes
  listarPacientes() {
    //METODO 1.- this.pacienteService.listar().subscribe(data => this.pacientes = data) ::: y en HTML esperaba un *ngFor="let p of pacientes"
    //
    //Para un observable se espera que un select lo recepcione asi  ::: *ngFor="let p of (pacientes$ | async)"
    this.pacientes$ = this.pacienteService.listar();
  }

  listarMedicos() {
    this.medicos$ = this.medicoService.listar();
  }

  listarEspecialidades() {
    this.especialidades$ = this.especialidadService.listar();
  }

  listarExamenes() {
    this.examenes$ = this.examenService.listar();
  }
}
