import { ActivatedRoute, Router, Params } from '@angular/router';
import { ExamenService } from './../../../_service/examen.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Examen } from './../../../_model/examen';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-examen-edicion',
  templateUrl: './examen-edicion.component.html',
  styleUrls: ['./examen-edicion.component.css']
})
export class ExamenEdicionComponent implements OnInit {
    //Crea variables
  id: number;
  examen: Examen;
  //inicializa un formgroup que esta acoplado a el html
  form: FormGroup;
  edicion: boolean = false;

  constructor(
    private examenService: ExamenService,
    //Clase para obtener el id que viene en la ruta
    private route: ActivatedRoute,
    //Clase para poder rutear de un componente a otro
    private router: Router) {
  }

  ngOnInit() {

    //instancia la variable especialidad
    this.examen = new Examen();
    //inicializa el form vacio
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl(''),
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
      this.examenService.listarPorId(this.id).subscribe(data => {
        //Luego de buscar la especialidad por ID llena informacion en el formulario
        let id = data.idExamen;
        let nombre = data.nombre;
        let descripcion = data.descripcion

        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombre': new FormControl(nombre),
          'descripcion': new FormControl(descripcion)
        });
      });
    }
  }

  operar() {//OBTIENE DEL FORM EL NUEVO VALOR QUE SE HA MODIFICADO
    this.examen.idExamen = this.form.value['id'];
    this.examen.nombre = this.form.value['nombre'];
    this.examen.descripcion = this.form.value['descripcion'];
    //VALIDA QUE HALLA INFO
    if (this.examen != null && this.examen.idExamen > 0) {
      //BUENA PRACTICA
      //UNA VEZ SETEADA EL EXAMEN LO MANDAMOS AL SERVICE
      //LUEGO TRABAJAMOS EL NUEVO FLUJO CON EL PIPE,
      //switchMap().- SE TRABAJA VACIO YA QUE NO DEVUELVE NADA
      //RECONSTRUIMOS LA NUEVA LISTA, UNA VEZ TERMINADO RECIEN CREAMOS LA NUEVA LISTA
      this.examenService.modificar(this.examen).pipe(switchMap(() => {
        return this.examenService.listar();
      })).subscribe(data => {
        this.examenService.setExamenCambio(data);
        this.examenService.setMensajeCambio("Modificado Correctamente");
      });
    } else {
      //PRACTICA COMUN
      this.examenService.registrar(this.examen).subscribe(data => {
        this.examenService.listar().subscribe(especialidad => {
          this.examenService.setExamenCambio(especialidad);
          this.examenService.setMensajeCambio("Registrado Correctamente");
        });
      });
    }//LUEGO QUE OPERA RUTEA A EXAMEN
    this.router.navigate(['pages/examen']);
  }

}
