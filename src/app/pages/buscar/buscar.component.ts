import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Consulta } from 'src/app/_model/consulta';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { BuscarDialogoComponent } from './buscar-dialogo/buscar-dialogo.component';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FiltroConsultaDTO } from 'src/app/_dto/FiltroConsultaDTO';
import { MenuService } from 'src/app/_service/menu.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form: FormGroup; //Variable para instanciar un Formulario y poder manipularlo desde TS
  maxFecha: Date = new Date(); //Variable fecha
  //Cuando se tiene un paginator se debe tener: displayedColumns y dataSource segun documentacion
  //displayedColumns.- Albergara todos los campos a mostrar
  displayedColumns = ['paciente', 'medico', 'especialidad', 'fecha', 'acciones'];
  //El arreglo del objeto
  dataSource: MatTableDataSource<Consulta>;
  //INSTANCIAMOS PARA MAS ADELANTE TENER UNA NUEVA PAGINACION
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //INSTANCIAMOS PARA PODER ORDENAR MI PAGINACION
  @ViewChild(MatSort) sort: MatSort;
  usuario: string;

  constructor( //Inyeccion a estas clases
    private consultaService: ConsultaService,
    private dialog: MatDialog,
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
    //Al iniciar el componente inicializamos el form en blanco
    this.form = new FormGroup({ //creamos instancia de lo que esta en UI
      'dni': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta': new FormControl()
    });
  }

  buscar() {
    let fecha = this.form.value['fechaConsulta']; //OBTENEMOS LA FECHA
    //VALIDAMOS SI LA FECHA ES NULA, SI NO ES NULA LA ALMACENAMOS EN LET FECHA
    fecha = fecha != null ? moment(fecha).format('YYYY-MM-DDTHH:mm:ss') : '';
    //OBTENEMOS LOS PARAMETROS DE UI Y LO REPRESENTAMOS EN MODELO DTO, REPRESENTADO EN LET FILTRO
    let filtro = new FiltroConsultaDTO(this.form.value['dni'], this.form.value['nombreCompleto']);
    //YA QUE DE UI NOS MOSTRARA EN JSON, VALIDAMOS QUE LAS VARIABLES TENGA DATA,
    //SINO ELIMINAMOS DEL JSON
    if (filtro.dni.length === 0) {
      delete filtro.dni;
    }
    if (filtro.nombreCompleto.length === 0) {
      delete filtro.nombreCompleto
    }
    //VERIFICAMOS QUE VARIABLE TIENE DATA Y OPERAMOS LA BUSQUEDA
    //LUEGO GENERAMOS LA NUEVA TABLA
    if (fecha != null && fecha !== "") {
      this.consultaService.buscarFecha(fecha).subscribe(data => this.crearTabla(data));
    } else {
      this.consultaService.buscarOtros(filtro).subscribe(data => this.crearTabla(data));
    }

  }

  crearTabla(data: Consulta[]) {//Seteamos los valores al datasource
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //con este metodo abrimos un dialogo y enviamos el componente a abrir + la data de UI
  verDetalle(consulta: Consulta) {
    this.dialog.open(BuscarDialogoComponent, {
      data: consulta
    });
  }


}
