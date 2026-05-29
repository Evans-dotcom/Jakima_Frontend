import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormatNumberPipe } from '../../shared/pipes/format-number.pipe';
import { KPIStatusPipe } from '../../shared/pipes/kpi-status.pipe';
import { SharedModule } from '../../shared/shared.module';

// const routes: Routes = [
//   { path: '', component: ReportsComponent }
// ];

@NgModule({
  declarations: [
    //ReportsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    //RouterModule.forChild(routes)
  ]
})
export class ReportsModule { }