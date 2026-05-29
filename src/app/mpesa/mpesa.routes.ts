// import { Routes } from '@angular/router';
// import { AuthGuard } from '../core/guards/auth.guard';

// export const MPESA_ROUTES: Routes = [
//   {
//     path: '',
//     loadComponent: () => import('./mpesa-shell.component').then(m => m.MpesaShellComponent),
//     canActivate: [AuthGuard],
//     children: [
//       {
//         path: 'stk-push',
//         loadComponent: () => import('./stkpush/stk-push.component').then(m => m.StkPushComponent),
//         data: { title: 'STK Push Payment' }
//       },
//       {
//         path: 'status',
//         loadComponent: () => import('./transactions/transaction-status.component').then(m => m.TransactionStatusComponent),
//         data: { title: 'Check Transaction Status' }
//       },
//       {
//         path: 'transactions',
//         loadComponent: () => import('./transactions/transactions.component').then(m => m.TransactionsComponent),
//         data: { title: 'My Transactions' }
//       },
//       {
//         path: 'all-transactions',
//         loadComponent: () => import('./transactions/all-transactions.component').then(m => m.AllTransactionsComponent),
//         canActivate: [AuthGuard],
//         data: { title: 'All Transactions', roles: ['Admin', 'Management'] }
//       },
//       {
//         path: 'diagnostics',
//         loadComponent: () => import('./diagnostics/diagnostics.component').then(m => m.DiagnosticsComponent),
//         canActivate: [AuthGuard],
//         data: { title: 'M-Pesa Diagnostics', roles: ['Admin'] }
//       },
//       {
//         path: '',
//         redirectTo: 'stk-push',
//         pathMatch: 'full'
//       }
//     ]
//   }
// ];