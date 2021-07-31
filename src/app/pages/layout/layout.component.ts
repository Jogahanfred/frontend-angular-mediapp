import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/_model/menu';
import { LoginService } from 'src/app/_service/login.service';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  //variable que contendra los roles de acuerdo al usuario
  menus: Menu[];

  constructor(
    private menuService: MenuService,
    //de modo publico para poder utilizar en el HTML
    public loginService: LoginService) {}

  ngOnInit(): void {
    //de los cambios actualizado en el componente inicio, aqui modifico los cambios
    this.menuService.getMenuCambio().subscribe(data => {
      //guardamos la data en la variable para poder iterar en el HTML
      this.menus = data;
    });
  }
}
