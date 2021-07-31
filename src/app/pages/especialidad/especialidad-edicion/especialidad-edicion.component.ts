import { ActivatedRoute, Router, Params } from '@angular/router';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Especialidad } from './../../../_model/especialidad';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-especialidad-edicion',
  templateUrl: './especialidad-edicion.component.html',
  styleUrls: ['./especialidad-edicion.component.css']
})
export class EspecialidadEdicionComponent implements OnInit {
  //Crea variables
  id: number;
  especialidad: Especialidad;
  //inicializa un formgroup que esta acoplado a el html
  form: FormGroup;
  edicion: boolean = false;
  constructor(
    private especialidadService: EspecialidadService,
    //Clase para obtener el id que viene en la ruta
    private route: ActivatedRoute,
    //Clase para poder rutear de un componente a otro
    private router: Router) {
  }

  ngOnInit() {
    //instancia la variable especialidad
    this.especialidad = new Especialidad();
    //inicializa el form vacio
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl('')
    });
    //De la ruta, obtene los parametros; en este caso en id
    this.route.params.subscribe((params: Params) => {
      //guarda el id en la variable id
      this.id = params['id'];
      //true o false si existe id
      this.edicion = params['id'] != null;
      //ejecuta metodo initForms()
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {//Si la variable edicion es true continua
      this.especialidadService.listarPorId(this.id).subscribe(data => {
        //Luego de buscar la especialidad por ID llena informacion en el formulario
        let id = data.idEspecialidad;
        let nombre = data.nombre;
        let descripcion = data.descripcion;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombre': new FormControl(nombre),
          'descripcion': new FormControl(descripcion)
        });
      });
    }
  }

  operar() {//OBTIENE DEL FORM EL NUEVO VALOR QUE SE HA MODIFICADO
    this.especialidad.idEspecialidad = this.form.value['id'];
    this.especialidad.nombre = this.form.value['nombre'];
    this.especialidad.descripcion = this.form.value['descripcion'];
    //VALIDA QUE HALLA INFO
    if (this.especialidad != null && this.especialidad.idEspecialidad > 0) {
      //BUENA PRACTICA
      //UNA VEZ SETEADA LA ESPECIALIDAD LO MANDAMOS AL SERVICE
      //LUEGO TRABAJAMOS EL NUEVO FLUJO CON EL PIPE,
      //switchMap().- SE TRABAJA VACIO YA QUE NO DEVUELVE NADA
      //RECONSTRUIMOS LA NUEVA LISTA, UNA VEZ TERMINADO RECIEN CREAMOS LA NUEVA LISTA
      this.especialidadService.modificar(this.especialidad).pipe(switchMap(() => {
        return this.especialidadService.listar();
      })).subscribe(data => {
        this.especialidadService.setEspecialidadCambio(data);
        this.especialidadService.setMensajeCambio("Modificado Correctamente");
      });
    } else {
      //PRACTICA COMUN
      this.especialidadService.registrar(this.especialidad).subscribe(data => {
        this.especialidadService.listar().subscribe(especialidad => {
          this.especialidadService.setEspecialidadCambio(especialidad);
          this.especialidadService.setMensajeCambio("Registrado Correctamente");
        });
      });
    } //LUEGO QUE OPERA RUTEA A ESPECIALIDAD
    this.router.navigate(['pages/especialidad']);
  }
}
