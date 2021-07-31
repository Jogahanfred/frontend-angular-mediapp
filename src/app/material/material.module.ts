import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { MatPaginatorImpl } from './mat-paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from './custom-adapter';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    MatDividerModule,
    MatMenuModule,
    MatToolbarModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    //Para calendario
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatListModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatProgressBarModule
    //
  ],
  //PROVIDERS .- se utiliza para poder implementar la clase de paginator y cambiar el idioma
  providers:[
    { provide: MatPaginatorIntl, useClass: MatPaginatorImpl},
    //Para la fecha muestre formato dd/mm/yyyy
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    //Para que cuando ingrese la fecha lo adapte a date
    { provide: DateAdapter, useClass: CustomDateAdapter }

  ]
})
export class MaterialModule {}
