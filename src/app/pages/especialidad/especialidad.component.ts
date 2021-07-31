import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from './../../_service/especialidad.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Especialidad } from './../../_model/especialidad';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuService } from 'src/app/_service/menu.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit {

   //Cuando se tiene un paginator se debe tener: displayedColumns y dataSource segun documentacion
  //displayedColumns.- Albergara todos los campos a mostrar
  displayedColumns = ['id', 'nombre', 'acciones'];
  dataSource: MatTableDataSource<Especialidad>;
  //INSTANCIAMOS PARA MAS ADELANTE TENER UNA NUEVA PAGINACION
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //INSTANCIAMOS PARA PODER ORDENAR MI PAGINACION
  @ViewChild(MatSort) sort: MatSort;

  usuario: string;

  constructor(//inyeccion de servicios
    private especialidadService: EspecialidadService,
    private snackBar: MatSnackBar,
    //Se coloca modo publico, para poder mostrar y ocultar el div que la edicion
    public route: ActivatedRoute,
    private menuService: MenuService,
    private refreshMenu: RefreshMenuService
    ) { }

  ngOnInit(): void {//inicializamos
       //guardamos el usuario del token a nuestra variable
       this.usuario = this.refreshMenu.mostrarMenu().username;

       this.menuService.listarPorUsuario(this.usuario).subscribe((data) => {
         //para que refresque las opciones de menu de acuerdo al usuario
         this.menuService.setMenuCambio(data);
       });
    //se llama este metodo cuando existe un NEXT que esta en los service que se ha utilizado
    //conclusion, despues de un insertar actualiza la tabla
    this.especialidadService.getEspecialidadCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    //muestra mensaje de los cambios guardados
    this.especialidadService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });
    //1.- cuando inicializa se lista las especialidades
    this.especialidadService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  //datasource tiene un metodo filter .toLowerCase().- no es sensible
  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }
  //elimina
  //pipe es para poder trabajar con el objeto de rspta
  //switchMap .- como no devuelve valor se trabaja : () y se vuelve a listar
  //luego, terminado el flujo se genera la nueva lista y manda mensaje
  eliminar(especialidad: Especialidad) {
    this.especialidadService.eliminar(especialidad.idEspecialidad).pipe(switchMap(() => {
      return this.especialidadService.listar();
    })).subscribe(data => {
      this.especialidadService.setEspecialidadCambio(data);
      this.especialidadService.setMensajeCambio('Eliminado Correctamente');
    });
  }
}
