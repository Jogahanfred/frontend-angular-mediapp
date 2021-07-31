import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Medico } from 'src/app/_model/medico';
import { MedicoService } from 'src/app/_service/medico.service';
import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';
import { switchMap } from 'rxjs/operators';
import { MenuService } from 'src/app/_service/menu.service';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  //1.-DisplayColumn de las columnas a mostrar
  displayedColumns: string[] = ['idMedico','nombres','apellidos','cmp','acciones'];
  //2.-Necesitamos una varible Datasource
  dataSource : MatTableDataSource<Medico>;
  //3.-ViewChiel que permite tener referencia una etiqueta de HTML para poder luego manipularlo: Como un elementById
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //4.-Inyeccion a MedicoService para poder hacer el CRUD
  usuario: string;
  constructor(
    //4.-Inyeccion
    private medicoService:MedicoService,
    //5.-Para mensaje emergente
    private snackBar: MatSnackBar,
    //11.-Instaciar MatDialog para poder utilizarlo
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
    //6.-Al inicializar la pagina traeremos la data y le enviamos al metodo Crear tabla para que lo renderize
    this.medicoService.listar().subscribe(data =>{
      this.crearTabla(data);
    })

     //Etse metodo reactivo se activa cuando en un componente lo han llamado con el metodo NEXT
     this.medicoService.getMedicoCambio().subscribe(data =>{
      this.crearTabla(data);
    })

    this.medicoService.getMensajeCambio().subscribe( data =>{
      this.snackBar.open(data, 'AVISO',{
        duration : 2000,
        verticalPosition : "bottom",
        horizontalPosition : "right"
      });
    })
  }

  //Estos son Metodos que seran llamados en cualquier momento
  //7.-Creamos el metodo CrearTabla para poder renderizar la lista, enviamos lo que pide DATASOURCE
  crearTabla(data: Medico[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //8.-Metodo Filtrar
  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();

  }

  //9.- Metodo abrirDialogo.- Aqui se indica que es opcional
  // ya que cuando edita se enviara medico, pero cuando se registre entrara en blanco
  abrirDialogo(medico? : Medico){
    //12.- al abrir este metodo abriremos el dialog instaciado, y el dialogo recibe como
    // parametro un componente a mostrar, y un bloque de configuracion ya sea de tamaño
    this.dialog.open(MedicoDialogoComponent,{
      width:'250px',
      data: medico
    });
  }

  //10.-Eliminar
  eliminar(medico: Medico){
    this.medicoService.eliminar(medico.idMedico).pipe(switchMap ( () => {
      return this.medicoService.listar();
    } ))
    .subscribe(data => {
      this.medicoService.setMedicoCambio(data);
      this.medicoService.setMensajeCambio("Eliminado Correctamente");
    })
  }
}



