import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServerErrorsInterceptor } from './shared/server-errors.interceptor';
import { InterceptorService } from './loader/interceptor.service';
import { LoginComponent } from './pages/login/login.component';
import { MaterialModule } from './material/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {JwtModule} from "@auth0/angular-jwt"
import { environment } from 'src/environments/environment';

export function tokenGetter(){
  //obtenemos el token obtenidos para acceder a las peticiones y la setearemos a todas las peticiones en la parte inferior estan los pasos
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    //Solo ira LOGINCOMPONENT ya que sera el unico que nos interesa al iniciar el proyecto, porque los demas componentes seran gestionados por pages.component
    LoginComponent
  ],
  imports: [
    BrowserModule,
    //Cuando se acciona al app.module, arranca el app.routing que esta declarado en sus import: en este caso el AppRoutingModule
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,  //Activar cuando se trabajara con formularios
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,  //Activar cuando se trabajara con TWOBINDIG
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule,
    //Para interceptar y pasarel token a las peticiones CONFIGURACION
    JwtModule.forRoot({
      config: {tokenGetter: tokenGetter,
              //Obtenemos el dominio a partir de caracter 7 o despues de http:// segun documentacion
              allowedDomains: [environment.HOST.substring(7)],
              disallowedRoutes: [`http://${environment.HOST.substring(7)}/login/enviarCorreo`]
            }
    })
  ],
  providers: [
    {
      //Intersecta los errores
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    {
      //Intersecta  spinner
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
