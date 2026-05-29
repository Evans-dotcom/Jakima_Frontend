import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MPESA_ROUTES } from './mpesa.routes';

import { MpesaShellComponent } from './mpesa-shell.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { DiagnosticsComponent } from './diagnostics/diagnostics.component';
import { StkPushComponent } from './stkpush/stk-push.component';
import { TransactionStatusComponent } from './transactions/transaction-status.component';
import { AllTransactionsComponent } from './transactions/all-transactions.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MPESA_ROUTES),
    
    // Standalone components
    MpesaShellComponent,
    StkPushComponent,
    TransactionStatusComponent,
    TransactionsComponent,
    AllTransactionsComponent,
    DiagnosticsComponent
  ]
})
export class MpesaModule { }