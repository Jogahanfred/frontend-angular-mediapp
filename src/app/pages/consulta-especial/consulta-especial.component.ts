import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConsultaListaExamenDTO } from 'src/app/_dto/ConsultaListaExamenDTO';
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
import { MenuService } from 'src/app/_service/menu.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';

@Component({
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css']
})
export class ConsultaEspecialComponent implements OnInit {
  //INSTANCIAMOS UNA VARIABLE FORMGROUP.-CUANDO SE TRABAJARA CON FORMULARIOS
  form: FormGroup;
  //INSTANCIAMOS ARREGLO DE OBJETOS
  pacientes: Paciente[];
  medicos: Medico[];
  especialidades: Especialidad[];
  examenes: Examen[];
  //INSTANCIAMOS UN ARRAY VACIO
  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  diagnostico: string;
  tratamiento: string;
  mensaje: string;
  fechaSeleccionada: Date = new Date();

  //INSTANCIAMOS ESTA VARIABLE CON LA FECHA ACTUAL
  maxFecha: Date = new Date();

  pacienteSeleccionado: Paciente;
  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  examenSeleccionado: Examen;

  //utiles para autocomplete
  myControlPaciente: FormControl = new FormControl();
  myControlMedico: FormControl = new FormControl();
  //OBSERVABLES
  pacientesFiltrados$: Observable<Paciente[]>;
  medicosFiltrados$: Observable<Medico[]>;

  usuario: string;

  constructor(//INYECCION A LOS SERVICIOS Y SNACKBAR PARA MSJ
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private especialidadService: EspecialidadService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar,
    private menuService: MenuService,
    private refreshMenu: RefreshMenuService
  ) { }

  ngOnInit(): void {//INICIALIZAMOS EL FORMULARIO VACIO
    //guardamos el usuario del token a nuestra variable
    this.usuario = this.refreshMenu.mostrarMenu().username;

    this.menuService.listarPorUsuario(this.usuario).subscribe((data) => {
      //para que refresque las opciones de menu de acuerdo al usuario
      this.menuService.setMenuCambio(data);
    });

    this.form = new FormGroup({
      'paciente': this.myControlPaciente,
      'especialidad': new FormControl(),
      'medico': this.myControlMedico,
      'fecha': new FormControl(new Date()),
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl('')
    });
    //INICIALIZAMOS LLENAS LAS LISTAS
    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();

    //PacienteFiltrado estara poblado cuando pase un cambio en mycontrolpaciente
    //La data obtenida de mycontrolpaciente, se enviara al metodo filtrarPacientes para procesar y
    //luego se almacenara en el observable
    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
    this.medicosFiltrados$ = this.myControlMedico.valueChanges.pipe(map(val => this.filtrarMedicos(val)));
  }



  //Colocar de tipo any: ya que toLowerCase funciona con string mas no con objetos
  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) { //si viene un objeto masyor a 0 es porque ya le hicieron click en la lista
      //se hace sobre el objeto y atributo
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }
    //se hace al string
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  filtrarMedicos(val: any) {
    if (val != null && val.idMedico > 0) {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.cmp.includes(val.cmp));
    } else {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val?.toLowerCase()) || option.apellidos.toLowerCase().includes(val?.toLowerCase()) || option.cmp.includes(val));
    }
  }

  //ESTAS LISTAS NO SE UTILIZARAN EN EL HTML PERO SI SE UTILIZARAN EN EL METODO filtrarMedicos
  listarPacientes(){
    this.pacienteService.listar().subscribe(data =>{
      this.pacientes = data;
    })
  }

  listarMedicos() {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }

  listarEspecialidad() {
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  listarExamenes() {
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    });
  }
  //mostrara el objeto escogido
  mostrarMedico(val: any) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  //val: Paciente reemplaze por tipo any.- que vendra lo que sea
  mostrarPaciente(val: any) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }
  //Esto es para una lista anidada
  seleccionarEsp(e : any){
    console.log(e);
    //console.log(e.value.idPais);
    //service.listarProvincias(idPais).subscribe( data => this.lista = data);
  }

   //metodo para que se guarde en memoria lo registradi en UI
   agregar() {
    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta(); // DIAGNOSTICO - TRATAMIENTO
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      //AGREGA LA INSTANCIA CON LA INFO AL ARREGLO INSTANCIADO INICIALMEN
      this.detalleConsulta.push(det);//LUEGO LIMPIA LOS INPUT
      this.diagnostico = '';       this.tratamiento = '';
    }    //HASTA AQUI TENEMOS DETALLECONSULTA LLENO
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
      if (cont > 0) {//SI SE REPITE MUESTRA MENSAJE
        this.mensaje = `El examen se encuentra en la lista`;        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      } else {        //SI NO SE REPITE hace un push
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {//SI NO debe agregar examen
      this.mensaje = `Debe agregar un examen`;      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }

  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 ||   this.especialidadSeleccionada === null ||
            this.medicoSeleccionado === null || this.pacienteSeleccionado === null);
  }



  aceptar(){
    let consulta = new Consulta();
    //captura e inserta la data en consulta
    consulta.paciente = this.form.value['paciente'];
    consulta.medico = this.form.value['medico'];
    consulta.especialidad = this.form.value['especialidad'];
    consulta.numConsultorio = "C1";
    //libreria para date
    //moment es una libreria que ayudara en los formatos de fecha
    consulta.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;
    //PUSH PARA PODER HACER LA TRANSACCION QUE ESPERA EL BACKEND
    //la estructura que espera el FRONTEND- Debe tener el mismo nombre del BACKEND
    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Consulta Registrada Correctamente", "Aviso", { duration: 2000 });
      setTimeout(() => {
        this.limpiarControles();
      }, 2000)

    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = new Paciente();//null
    this.especialidadSeleccionada = new Especialidad();//null;
    this.medicoSeleccionado = new Medico();//null;
    this.examenSeleccionado = new Examen();//null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
    //para autocompletes
    this.myControlPaciente.reset();
    this.myControlMedico.reset();
  }
}
