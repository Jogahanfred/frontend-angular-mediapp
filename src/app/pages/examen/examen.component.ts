import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { Examen } from 'src/app/_model/examen';
import { ExamenService } from 'src/app/_service/examen.service';
import { MenuService } from 'src/app/_service/menu.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {
  //Cuando se tiene un paginator se debe tener: displayedColumns y dataSource segun documentacion
  //displayedColumns.- Albergara todos los campos a mostrar
  displayedColumns = ['id', 'nombre', 'descripcion', 'acciones'];
  dataSource: MatTableDataSource<Examen>;
  //INSTANCIAMOS PARA MAS ADELANTE TENER UNA NUEVA PAGINACION
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //INSTANCIAMOS PARA PODER ORDENAR MI PAGINACION
  @ViewChild(MatSort) sort: MatSort;
  usuario: string;
  constructor(//INYECCION
    private examenService: ExamenService,
    private snackBar: MatSnackBar,

    private menuService: MenuService,
    private refreshMenu: RefreshMenuService
    ) { }

  ngOnInit() {
       //guardamos el usuario del token a nuestra variable
       this.usuario = this.refreshMenu.mostrarMenu().username;

       this.menuService.listarPorUsuario(this.usuario).subscribe((data) => {
         //para que refresque las opciones de menu de acuerdo al usuario
         this.menuService.setMenuCambio(data);
       });
    //se llama este metodo cuando existe un NEXT que esta en los service que se ha utilizado
    //conclusion, despues de un insertar actualiza la tabla
    this.examenService.getExamenCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    //muestra mensaje de los cambios guardados
    this.examenService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });
    //1.- cuando inicializa se lista las EXAMENES
    this.examenService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
  eliminar(examen: Examen) {
    this.examenService.eliminar(examen.idExamen).pipe(switchMap(() => {
      return this.examenService.listar();
    })).subscribe(data => {
      this.examenService.setExamenCambio(data);
      this.examenService.setMensajeCambio('Eliminado Correctamente');
    });

  }

}

