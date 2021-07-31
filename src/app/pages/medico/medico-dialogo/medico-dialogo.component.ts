import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medico } from 'src/app/_model/medico';
import { MedicoService } from 'src/app/_service/medico.service';
//importar para evitar anidaciones
import { switchMap } from 'rxjs/operators';
import { LoaderService } from 'src/app/loader/loader.service';

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css'],
})
export class MedicoDialogoComponent implements OnInit {
  //14.- Creamos un varible tipo Medico para recepcionar la DATA
  medico: Medico;
  constructor(
    //16.-para controlar el dialogo y poder cerrarlo
    private dialogRef: MatDialogRef<MedicoDialogoComponent>,
    //17.-Inyecctamos el servicio
    private medicoService: MedicoService,
    //13.-Despues de MedicoComponent recibimos la data que nos envian por @Inyect
    @Inject(MAT_DIALOG_DATA) private data: Medico
  ) {}

  ngOnInit(): void {
    //15.- activamos el Forms Module el appmodule para poder utilizar el twobinding que esta en el HTML
    //Instanciamos el objeto y luego asignamos los nuevos valores
    //{ ...this.data } .- LOS 3 PUNTOS sirve para que se guarde los valores en cada atributo
    this.medico = { ...this.data };
    /*this.medico = new Medico();
    this.medico.idMedico = this.data.idMedico;
    this.medico.nombres = this.data.nombres;
    this.medico.apellidos = this.data.apellidos;
    this.medico.cmp = this.data.cmp;
    this.medico.fotoUrl = this.data.fotoUrl;*/
    //this.medico = this.data;
  }

  operar() {
    //17.-Operamos para poder registrar o actualizar
    //UNA VEZ QUE OPERE TIENE QUE CERRAR EL DIALOGO CON EL SUBJECT EN EL SERVICIO
    if (this.medico.idMedico != null && this.medico.idMedico > 0) {
      //MODIFICAR--pipe() para evitar la anidacion
      this.medicoService
        .modificar(this.medico)
        .pipe(
          switchMap(() => {
            return this.medicoService.listar();
          })
        )
        .subscribe((data) => {
          this.medicoService.setMedicoCambio(data);
          this.medicoService.setMensajeCambio('Modificado Correctamente');
        });
    } else {
      //REGISTRAR
      this.medicoService.registrar(this.medico).subscribe(() => {
        this.medicoService.listar().subscribe((data) => {
          this.medicoService.setMedicoCambio(data);
          this.medicoService.setMensajeCambio('Registrado Correctamente');
        });
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
