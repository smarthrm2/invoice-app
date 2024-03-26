import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MainBarComponent } from './main-bar/main-bar.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table'
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    HomeComponent,
    MainBarComponent,
    CustomCheckboxComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    InvoiceRoutingModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule
  ],
})
export class InvoicesModule {}
