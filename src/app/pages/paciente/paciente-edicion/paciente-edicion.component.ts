import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css'],
})
export class PacienteEdicionComponent implements OnInit {
  //Variable de tipo formgroup que almecenara el formulario
  form: FormGroup;
  //para recuperar el id que viene del front ActivatedRoute
  id: number;
  edicion: boolean;

  constructor(
    //para obtener lo que viene de la url Inyeccion de dependencia
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    //para navegar al otro componente despues de darle submit guardar
    private router : Router) {}

  ngOnInit(): void {
    //INICIALIZA EL FORM
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl(''),
      'email': new FormControl(''),
    });

    //Obtiene lo que viene en la URL
    this.route.params.subscribe((data:Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    })
  }

  initForm(){
    if(this.edicion){ //validamos si edicion es true o false
      this.pacienteService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({//CREAMOS UNA INSTANCIA DEL FORMGROUP Y LO SETEAMOS
          'id': new FormControl(data.idPaciente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'dni': new FormControl(data.dni),
          'telefono': new FormControl(data.telefono),
          'direccion': new FormControl(data.direccion),
          'email': new FormControl(data.email)
        });
      })
    }
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

    if (this.edicion) {
       this.pacienteService.modificar(paciente).subscribe(()=>{
         this.pacienteService.listar().subscribe(data => {
           this.pacienteService.setPacienteCambio(data);//Almaceno la lista nueva
           this.pacienteService.setMensajeCambio("Modificado Correctamente");
          this.router.navigate(['pages/paciente']);
         })
       });
    }else{
      this.pacienteService.registrar(paciente).subscribe(()=>{
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.setPacienteCambio(data);//Almaceno la lista nueva
          this.pacienteService.setMensajeCambio("Registrado Correctamente");
          this.router.navigate(['pages/paciente']);
        })
      });
    }
  }
}
