import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consulta } from 'src/app/_model/consulta';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { ListaExamenDTO } from 'src/app/_dto/listaExamenDTO';

@Component({
  selector: 'app-buscar-dialogo',
  templateUrl: './buscar-dialogo.component.html',
  styleUrls: ['./buscar-dialogo.component.css']
})

export class BuscarDialogoComponent implements OnInit {

  //VARIABLE CONSULTA
  consulta: Consulta;
  //VARIABLE LISTA DE EXAMEN DTO : consulta - examen
  examenes: ListaExamenDTO[];

  constructor(
    //MatDialogRef .- Es para manipular el dialogo y se le indica el componente
    private dialogRef: MatDialogRef<BuscarDialogoComponent>,
    //Para obtener la data que viene del componente que llamo el dialogo
    @Inject(MAT_DIALOG_DATA) private data: Consulta,
    private consultaService: ConsultaService
  ) { }

  ngOnInit(): void {
    //inicializa y se reconstruye la data en un tipo consulta
    this.consulta = this.data;
    //ejecuta metodo listarExamenes, porque la data ya viene pero
    //en consulta no esta examenes
    this.listarExamenes();
  }

  cerrar() {
    this.dialogRef.close();
  }

  //metodo para extraer examenes mediante el id del registro de la consulta
  listarExamenes() {
    this.consultaService.listarExamenPorConsulta(this.consulta.idConsulta).subscribe(data => {
      this.examenes = data;
    })
  }
}

