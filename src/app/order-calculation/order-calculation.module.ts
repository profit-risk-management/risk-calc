import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OrderCalculationComponent } from './order-calculation.component';
import { PreviewComponent } from './preview/preview.component';
import { CalculationItemComponent } from './calculation-item/calculation-item.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    OrderCalculationComponent,
    CalculationItemComponent,
    PreviewComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  exports: [OrderCalculationComponent],
  providers: [],
  bootstrap: [OrderCalculationComponent]
})
export class OrderCalculationModule { }
