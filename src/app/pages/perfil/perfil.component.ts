import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuService } from 'src/app/_service/menu.service';
import { MatAccordion } from '@angular/material/expansion';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  rol: string[];
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private menuService: MenuService,
    private refreshMenu: RefreshMenuService
  ) { }

  ngOnInit(): void {

        //guardamos el usuario del token a nuestra variable
        this.usuario = this.refreshMenu.mostrarMenu().username;

        //guardamos el rol del token a nuestra variable
        this.rol = this.refreshMenu.mostrarMenu().authorities

        this.menuService.listarPorUsuario(this.usuario).subscribe(data =>{
          //para que refresque las opciones de menu de acuerdo al usuario
          this.menuService.setMenuCambio(data);
        } )
  }

}
