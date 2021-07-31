import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RecuperarComponent } from './pages/login/recuperar/recuperar.component';
import { TokenComponent } from './pages/login/recuperar/token/token.component';
import { Not404Component } from './pages/not404/not404.component';

const routes: Routes = [
//Redirecciona cuando venga vacio u otro caracter despues de la ruta al LOGIN,
//Con esto gano que no me cargo en memoria los demas componentes, ya que pueda o no que inicie sesion
{
path: '',
pathMatch: 'full',
redirectTo: 'login'
},
//Declara la ruta login para direccionar al componente
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'recuperar', component: RecuperarComponent, children: [
    {path: ':token', component: TokenComponent}
  ]
},
//Al cargar pages, despues del correcto inicio de sesion, carga el module de la carpeta pages, y a  la vez el routing,
//para que pueda tener accion de tosos compontes y MODULE
{
  path: 'pages',
  component: LayoutComponent,
  loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
},
//Cuando vengan rutas desconocidas en el app.routing.module, principal
{ path: 'not-404', component: Not404Component },
{
  path: '**',
  redirectTo: 'not-404'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
