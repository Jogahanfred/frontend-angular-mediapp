


import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Paciente } from 'src/app/_model/paciente';
import { Signo } from 'src/app/_model/signo';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoService } from 'src/app/_service/signo.service';
import { SignoPacienteNuevoComponent } from './signo-paciente-nuevo/signo-paciente-nuevo.component';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css'],
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  pacientes: Paciente[];
  pacienteSeleccionado: Paciente;
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();


  constructor(
    private route: ActivatedRoute,
    private signoService: SignoService,
    private router : Router,
    private pacienteService: PacienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      'idSigno': new FormControl(0),
      'paciente': new FormControl(''),
      'fecha': new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });



    //Obtiene lo que viene en la URL
    this.route.params.subscribe((data:Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;

      this.initForm();
    })


    this.pacienteService.getMensajeCambio().subscribe( data =>{
      this.snackBar.open(data, 'AVISO',{
        duration : 2000,
        verticalPosition : "bottom",
        horizontalPosition : "right"
      });
    })

    this.pacienteService.getPacienteRegistrado().subscribe(data =>{
      this.listarPacientes();
      this.form = new FormGroup({
        'idSigno': new FormControl(this.form.value['idSigno']),
        'fecha': new FormControl(this.form.value['fecha']),
        'pulso': new FormControl(this.form.value['pulso']),
        'temperatura': new FormControl(this.form.value['temperatura']),
        'ritmoRespiratorio': new FormControl(this.form.value['ritmoRespiratorio']),
        'paciente': new FormControl(data.idPaciente),
      });
    })
    this.listarPacientes();
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.value;
  }

  initForm(){
    if(this.edicion){ //validamos si edicion es true o false
      this.signoService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({//CREAMOS UNA INSTANCIA DEL FORMGROUP Y LO SETEAMOS
          'idSigno': new FormControl(data.idSigno),
          'fecha': new FormControl(data.fecha),
          'pulso': new FormControl(data.pulso),
          'temperatura': new FormControl(data.temperatura),
          'ritmoRespiratorio': new FormControl(data.ritmoRespiratorio),
          'paciente': new FormControl(data.paciente.idPaciente),
        });
      })
    }
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  operar() {
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['paciente'];

    let signo = new Signo();
    signo.idSigno = this.form.value['idSigno'];
    signo.paciente = paciente;
    signo.fecha = this.form.value['fecha'];
    signo.temperatura = this.form.value['temperatura'];
    signo.pulso = this.form.value['pulso'];
    signo.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    signo.fecha = moment(this.fechaSeleccionada).format(
      'YYYY-MM-DDTHH:mm:ss'
    );

    if (this.edicion) {
      this.signoService.modificar(signo).subscribe(()=>{
        this.signoService.listar().subscribe(data => {
          this.signoService.setSignoCambio(data);//Almaceno la lista nueva
          this.signoService.setMensajeCambio("Modificado Correctamente");
        })
      });
   }else{
     this.signoService.registrar(signo).subscribe(()=>{
       this.signoService.listar().subscribe(data => {
         this.signoService.setSignoCambio(data);//Almaceno la lista nueva
         this.signoService.setMensajeCambio("Registrado Correctamente");
       })
     });
   }
   this.router.navigate(['pages/signos']);
  }

  nuevoPaciente(paciente?: Paciente){
    this.dialog.open(SignoPacienteNuevoComponent,{
      width:'450px',
      data: paciente,
    });
  }
}
