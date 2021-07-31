import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Signo } from 'src/app/_model/signo';
import { MenuService } from 'src/app/_service/menu.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';
import { SignoService } from 'src/app/_service/signo.service';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css'],
})
export class SignosComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<Signo>;
  displayedColumns: string[] = [
    'idPaciente',
    'nombres',
    'apellidos',
    'fecha',
    'temperatura',
    'pulso',
    'ritmoRespiratorio',
    'acciones',
  ];
  cantidad: number = 0;
  usuario: string;

  constructor(
    public route: ActivatedRoute,
    private signoService: SignoService,
    private snackBar: MatSnackBar,
    private menuService: MenuService,
    private refreshMenu: RefreshMenuService
  ) {}

  ngOnInit(): void {
     //guardamos el usuario del token a nuestra variable
     this.usuario = this.refreshMenu.mostrarMenu().username;

     this.menuService.listarPorUsuario(this.usuario).subscribe((data) => {
       //para que refresque las opciones de menu de acuerdo al usuario
       this.menuService.setMenuCambio(data);
     });
    this.signoService.listarPageable(0, 10).subscribe((data) => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

    //Este metodo reactivo se activa cuando en un componente lo han llamado con el metodo NEXT
    this.signoService.getSignoCambio().subscribe((data) => {
      this.crearTabla(data);
    });

    this.signoService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
    });
  }

  //Para no redundar creamos crear tabla
  crearTabla(data: Signo[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(id: number) {
    this.signoService.eliminar(id).subscribe(() => {
      this.signoService.listar().subscribe((data) => {
        //this.crearTabla(data);
        this.signoService.setSignoCambio(data);
        this.signoService.setMensajeCambio('Registro Eliminado');
      });
    });
  }
  //METODO PARA MOSTRAR MAS PAGINAS EN PAGINATOR
  mostrarMas(e: any) {
    this.signoService
      .listarPageable(e.pageIndex, e.pageSize)
      .subscribe((data) => {
        this.cantidad = data.totalElements;
        this.dataSource = new MatTableDataSource(data.content);
        this.dataSource.sort = this.sort;
      });
  }
}
