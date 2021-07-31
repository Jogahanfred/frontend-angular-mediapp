import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/_model/paciente';
import { LoaderService } from 'src/app/loader/loader.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MenuService } from 'src/app/_service/menu.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';


@Component({
  selector: 'app-paciente',
    templateUrl: './paciente.component.html',
    styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

    //Para referenciar un elemento de la vista (getElementById)
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //pacientes: Paciente[];
  dataSource : MatTableDataSource<Paciente>;
  displayedColumns: string[] = ['idPaciente','nombres','apellidos','acciones'];
  cantidad: number = 0;
  usuario: string;

  constructor(
    private pacienteService: PacienteService,
    //Si quiero utilizar el snackbar debo inyectarlo donde lo quiero utilizar
    private snackbar : MatSnackBar,
    //para que al refrescar la url aparezcan los menus
    private menuService: MenuService,
    private refreshMenu: RefreshMenuService
    ) {}

  //Este metodo inicializa cuando se ejecuta por primera ves el componente
  ngOnInit(): void {

  //guardamos el usuario del token a nuestra variable
  this.usuario = this.refreshMenu.mostrarMenu().username;

  this.menuService.listarPorUsuario(this.usuario).subscribe((data) => {
    //para que refresque las opciones de menu de acuerdo al usuario
    this.menuService.setMenuCambio(data);
  });
     /*this.pacienteService.listar().subscribe(data => {
      this.crearTabla(data);
    });*/

    this.pacienteService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });


    //Este metodo reactivo se activa cuando en un componente lo han llamado con el metodo NEXT
    this.pacienteService.getPacienteCambio().subscribe(data =>{
      this.crearTabla(data);
    })

    this.pacienteService.getMensajeCambio().subscribe( data =>{
      this.snackbar.open(data, 'AVISO',{
        duration : 2000,
        verticalPosition : "bottom",
        horizontalPosition : "right"
      });
    })


  }
    //Para no redundar creamos crear tabla
    crearTabla(data : Paciente[]){
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    filtrar(valor: string){
      this.dataSource.filter = valor.trim().toLowerCase();
    }

    eliminar(id: number){
      this.pacienteService.eliminar(id).subscribe(()=>{
        this.pacienteService.listar().subscribe(data =>{
          //this.crearTabla(data);
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio("Registro Eliminado")
        })
      })
    }
    //METODO PARA MOSTRAR MAS PAGINAS EN PAGINATOR
    mostrarMas(e: any){
      this.pacienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
        this.cantidad = data.totalElements;
        this.dataSource = new MatTableDataSource(data.content);
        this.dataSource.sort = this.sort;
      });
    }
  }
