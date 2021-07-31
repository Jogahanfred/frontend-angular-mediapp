import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-signo-paciente-nuevo',
  templateUrl: './signo-paciente-nuevo.component.html',
  styleUrls: ['./signo-paciente-nuevo.component.css'],
})
export class SignoPacienteNuevoComponent implements OnInit {


  form: FormGroup;
  id: number;
  idPacienteRegistrado: number;

  constructor(
    //para obtener lo que viene de la url Inyeccion de dependencia
    private dialogRef: MatDialogRef<SignoPacienteNuevoComponent>,
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //INICIALIZA EL FORM
    this.form = new FormGroup({
      id: new FormControl(0),
      nombres: new FormControl(''),
      apellidos: new FormControl(''),
      dni: new FormControl(''),
      telefono: new FormControl(''),
      direccion: new FormControl(''),
      email: new FormControl(''),
    });
  }

  //IMPORTANTE EL CANCELAR ES TYPE='BUTTON' PARA QUE NO LLAME AL SUBMIT
  operar() {
    let paciente = new Paciente();
    //SETEAMOS LOS NUEVOS VALORES
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];
    paciente.email = this.form.value['email'];

    this.pacienteService.registrar(paciente).subscribe(() => {
      this.pacienteService.listar().subscribe((data) => {
        this.pacienteService.setPacienteCambio(data); //Almaceno la lista nueva
        this.pacienteService.setMensajeCambio('Paciente Registrado');
      });
      this.pacienteService.listarPorDni(paciente.dni).subscribe((data) =>{
       this.pacienteService.setPacienteRegistrado(data);
        this.cerrar();
      });
    });
  }
  cerrar() {
    this.dialogRef.close();
  }
}


