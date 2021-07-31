import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Consulta } from 'src/app/_model/consulta';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { Medico } from 'src/app/_model/medico';
import { Paciente } from 'src/app/_model/paciente';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import * as moment from 'moment';
import { ConsultaListaExamenDTO } from 'src/app/_dto/ConsultaListaExamenDTO';
import { MenuService } from 'src/app/_service/menu.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {
  //PARA PODER CONTROLLAR EL STEPPER
  @ViewChild('stepper') stepper: MatStepper;
  //INICIALIZAMOS DESACTIVADO
  isLinear: boolean = false;
  //CREO FORMGROUP Y LUEGO CONCATENAREMOS ESOS FORMS
  primerFormGroup: FormGroup;
  segundoFormGroup: FormGroup;
  //DECLARAMOS ARREGLOS
  pacientes: Paciente[];
  especialidades: Especialidad[];
  medicos: Medico[];
  examenes: Examen[];
  //INSTANCIAMOS
  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  pacienteSeleccionado: Paciente;
  examenSeleccionado: Examen;
  fechaSeleccionada: Date = new Date();
  //VARIABLE CON EL VALOR ACTUAL
  maxFecha: Date = new Date();
  diagnostico: string;
  tratamiento: string;
  mensaje: string;
  //ARREGLOS DE MODELOS
  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  consultorios: number[] = [];
  consultorioSeleccionado: number = 0;
  usuario: string;


  constructor(//INYECTAR SERVICIOS
    //INYECCION DE FORMBUIDER QUE NOS PERMITIRA CONCATENAR FORMULARIOS
    private formBuilder: FormBuilder,
    private pacienteService: PacienteService,
    private especialidadService: EspecialidadService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar,
    private menuService: MenuService,
    private refreshMenu: RefreshMenuService
  ) { }

  ngOnInit(): void {
     //guardamos el usuario del token a nuestra variable
     this.usuario = this.refreshMenu.mostrarMenu().username;

     this.menuService.listarPorUsuario(this.usuario).subscribe((data) => {
       //para que refresque las opciones de menu de acuerdo al usuario
       this.menuService.setMenuCambio(data);
     });
    this.primerFormGroup = this.formBuilder.group({
      //INICIALIZAMOS EL FORMULARIOY LO GUARDAMOS EN FORMBUILDER
      //SOLICITAMOS QUE SEA REQUERIDO EL FORM cboPaciente
      cboPaciente: [new FormControl(), Validators.required],
      fecha: [new FormControl(), new FormControl(new Date(), [Validators.required])],
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl(''),
    });
    //AGRUPAMOS CON EL SEGUNDO FORM
    this.segundoFormGroup = this.formBuilder.group({

    });
    //INICIALIALIZAMOS LAS LISTAS LLENAS
    this.listarPacientes();
    this.listarExamenes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarConsultorios();
  }
  //OBTIENE EL VALOR DEL CONSULTORIO
  seleccionarConsultorio(c: number) {
    this.consultorioSeleccionado = c;
  }
  //AGREGA LOS CONSULTORIOS EN UN ARRAY
  listarConsultorios() {
    for (let i = 1; i <= 100; i++) {
      this.consultorios.push(i);
    }
  }
  //OBTIENE LOS VALORES Y LO GUARDA EN UNA VARIABLE
  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.value;
  }

  seleccionarEspecialidad(e: any) {
    this.especialidadSeleccionada = e.value;
  }
  //LISTAR
  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  listarEspecialidad() {
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  listarMedicos() {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }

  listarExamenes() {
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    });
  }
 //metodo para que se guarde en memoria lo registradi en UI
  agregar() {

    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta();// DIAGNOSTICO - TRATAMIENTO
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      //AGREGA LA INSTANCIA CON LA INFO AL ARREGLO INSTANCIADO INICIALMEN
      this.detalleConsulta.push(det);
      this.diagnostico = '';
      this.tratamiento = '';
    } else {
      this.mensaje = `Debe agregar un diagnóstico y tratamiento`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
    //HASTA AQUI TENEMOS DETALLECONSULTA LLENO
  }

  //ELIMINAR
  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }

  agregarExamen() {
    if (this.examenSeleccionado) {//VALIDA QUE VENGA VALOR DE UI
      let cont = 0;
      //RECORREMOS LA LISTA EX..SELEC.. CUANTOS REG TIENE
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        //VALIDA SI YA EXISTE EN LA LISTA HACE UN BREAK Y SALE
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont++;
          break;
        }
      }
      //SI SE REPITE MUESTRA MENSAJE E INICIALIZA LA LISTA DE EXAMEN
      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      } else {//Y LUEGO LE HACE UN PUSH A ARRAY examenesSeleccionados
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
    //HASTA AQUI TENEMOS EXAMENES SELECCIONADOS LLENO
  }
  seleccionarMedico(medico: Medico) {
    this.medicoSeleccionado = medico;
  }
  //SELECCIONA EL CONSULTORIO
  nextManualStep() {
    if (this.consultorioSeleccionado > 0) {//CONSULTORIOSELEC ESTA SELECCIONADO
      //DESACTIVA LINEAR PARA PODER SEGUIR AVANZANDO
      this.stepper.linear = false;
      this.stepper.next();
    } else {
      this.snackBar.open('DEBES SELECCIONAR ASIENTO', 'INFO', { duration: 2000 });
    }
  }

  //HABILITA O DESHABILITA EL BOTON REGISTRAR
  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 ||
            this.especialidadSeleccionada === undefined ||
            this.medicoSeleccionado === undefined ||
            this.pacienteSeleccionado === undefined || this.consultorioSeleccionado === 0);
  }

  registrar() {
    let consulta = new Consulta();
    //captura e inserta la data en consulta
    consulta.especialidad = this.especialidadSeleccionada;
    consulta.medico = this.medicoSeleccionado;
    consulta.paciente = this.pacienteSeleccionado;
    //libreria para date
    //moment es una libreria que ayudara en los formatos de fecha
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;
    //CONCATENA C DE CONSULTORIO MAS EL NUMERO QUE ESCOGE
    consulta.numConsultorio = `C${this.consultorioSeleccionado}`;
    //PUSH PARA PODER HACER LA TRANSACCION QUE ESPERA EL BACKEND
    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Registrado Correctamente", "Aviso", { duration: 2000 });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = new Paciente();
    this.especialidadSeleccionada = new Especialidad();
    this.medicoSeleccionado = new Medico();
    this.examenSeleccionado = new Examen();
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.consultorioSeleccionado = 0;
    this.mensaje = '';
    this.stepper.reset();
  }
}
