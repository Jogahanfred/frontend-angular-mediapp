import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from '../material/material.module';
import { BuscarDialogoComponent } from './buscar/buscar-dialogo/buscar-dialogo.component';
import { BuscarComponent } from './buscar/buscar.component';
import { ConsultaEspecialComponent } from './consulta-especial/consulta-especial.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { EspecialidadEdicionComponent } from './especialidad/especialidad-edicion/especialidad-edicion.component';
import { EspecialidadComponent } from './especialidad/especialidad.component';
import { ExamenEdicionComponent } from './examen/examen-edicion/examen-edicion.component';
import { ExamenComponent } from './examen/examen.component';
import { MedicoDialogoComponent } from './medico/medico-dialogo/medico-dialogo.component';
import { MedicoComponent } from './medico/medico.component';
import { PacienteEdicionComponent } from './paciente/paciente-edicion/paciente-edicion.component';
import { PacienteComponent } from './paciente/paciente.component';
import { ReporteComponent } from './reporte/reporte.component';
import { WizardComponent } from './wizard/wizard.component';
import { LayoutComponent } from './layout/layout.component';
import { InicioComponent } from './inicio/inicio.component';
import { PagesRoutingModule } from './pages-routing.module';
import { Not403Component } from './not403/not403.component';
import { Not404Component } from './not404/not404.component';
import { TokenComponent } from './login/recuperar/token/token.component';
import { RecuperarComponent } from './login/recuperar/recuperar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PerfilComponent } from './perfil/perfil.component';
import { SignosComponent } from './signos/signos.component';
import { SignosEdicionComponent } from './signos/signos-edicion/signos-edicion.component';
import { SignoPacienteNuevoComponent } from './signos/signos-edicion/signo-paciente-nuevo/signo-paciente-nuevo.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    PdfViewerModule,
    PagesRoutingModule,
    MatProgressBarModule
  ],
  exports: [],
  declarations: [
    PacienteComponent,
    MedicoComponent,
    PacienteEdicionComponent,
    MedicoDialogoComponent,
    ExamenComponent,
    ExamenEdicionComponent,
    EspecialidadComponent,
    EspecialidadEdicionComponent,
    ConsultaComponent,
    ConsultaEspecialComponent,
    WizardComponent,
    BuscarComponent,
    BuscarDialogoComponent,
    ReporteComponent,
    LayoutComponent,
    InicioComponent,
    Not403Component,
    Not404Component,
    TokenComponent,
    RecuperarComponent,
    PerfilComponent,
    SignosComponent,
    SignosEdicionComponent,
    SignoPacienteNuevoComponent
  ],
  providers: [],
})
export class PagesModule {}
