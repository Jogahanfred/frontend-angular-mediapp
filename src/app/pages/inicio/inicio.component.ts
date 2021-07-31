import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/_service/menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { RefreshMenuService } from 'src/app/_service/refreshMenu.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  usuario: string;

  constructor(
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
  }
}
