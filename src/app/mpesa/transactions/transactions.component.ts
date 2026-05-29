// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { Subject, takeUntil } from 'rxjs';
// import { MpesaService, MpesaTransaction } from '../mpesa.service';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-transactions',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatCardModule, MatButtonModule, MatIconModule,
//     MatProgressSpinnerModule, MatSnackBarModule
//   ],
//   template: `
//     <div class="tx-shell">
//       <mat-card>
//         <mat-card-header>
//           <mat-icon mat-card-avatar class="card-icon blue">history</mat-icon>
//           <mat-card-title>My Transactions</mat-card-title>
//           <mat-card-subtitle>Your personal M-Pesa payment history</mat-card-subtitle>
//         </mat-card-header>
//         <mat-card-content>

//           <div class="toolbar">
//             <button mat-raised-button color="primary" (click)="load()" [disabled]="loading">
//               <mat-spinner *ngIf="loading" diameter="18"></mat-spinner>
//               <mat-icon *ngIf="!loading">refresh</mat-icon>
//               {{ loading ? 'Loading...' : 'Load My Transactions' }}
//             </button>
//             <span class="count-badge" *ngIf="transactions.length > 0">{{ transactions.length }} records</span>
//           </div>

//           <div class="tx-list" *ngIf="transactions.length > 0">
//             <div class="tx-item" *ngFor="let tx of transactions" (click)="select(tx)"
//                  [class.selected]="selected?.id === tx.id">
//               <div class="tx-left">
//                 <div class="tx-icon" [ngClass]="iconClass(tx.status)">
//                   <mat-icon>{{ statusIcon(tx.status) }}</mat-icon>
//                 </div>
//                 <div class="tx-meta">
//                   <span class="tx-ref">{{ tx.accountReference }}</span>
//                   <span class="tx-desc">{{ tx.transactionDesc }}</span>
//                   <span class="tx-phone">{{ tx.phoneNumber }}</span>
//                 </div>
//               </div>
//               <div class="tx-right">
//                 <span class="tx-amount">KES {{ tx.amount | number:'1.0-0' }}</span>
//                 <span class="status-chip" [ngClass]="tx.status.toLowerCase()">{{ tx.status }}</span>
//                 <span class="tx-date">{{ tx.createdAt | date:'shortDate' }}</span>
//               </div>
//             </div>
//           </div>

//           <!-- Detail panel -->
//           <div class="detail-panel" *ngIf="selected">
//             <h3>Transaction Details</h3>
//             <div class="detail-grid">
//               <div class="detail-item"><span class="d-label">Receipt No.</span><span class="d-val mono">{{ selected.mpesaReceiptNumber || '—' }}</span></div>
//               <div class="detail-item"><span class="d-label">Checkout ID</span><span class="d-val mono">{{ selected.checkoutRequestID }}</span></div>
//               <div class="detail-item"><span class="d-label">Result</span><span class="d-val">{{ selected.resultDesc }}</span></div>
//               <div class="detail-item"><span class="d-label">Transaction Date</span><span class="d-val">{{ selected.transactionDate | date:'medium' }}</span></div>
//             </div>
//           </div>

//           <div class="empty-state" *ngIf="transactions.length === 0 && !loading">
//             <mat-icon>receipt_long</mat-icon>
//             <p>Click "Load My Transactions" to view your history</p>
//           </div>

//         </mat-card-content>
//       </mat-card>
//     </div>
//   `,
//   styles: [`
//     .tx-shell { padding: 4px 0; }
//     mat-card { border-radius: 16px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; }
//     mat-card-header { padding: 20px 20px 0 !important; }
//     .card-icon { border-radius: 10px !important; width: 40px !important; height: 40px !important; display: flex !important; align-items: center; justify-content: center; font-size: 22px !important; }
//     .card-icon.blue { background: #dbeafe; color: #2563eb; }
//     .toolbar { display: flex; align-items: center; gap: 16px; padding: 16px 0; }
//     .count-badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 100px; font-size: 13px; font-weight: 600; }
//     .tx-list { display: flex; flex-direction: column; gap: 4px; max-height: 500px; overflow-y: auto; }
//     .tx-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 12px; border: 1px solid #f3f4f6; border-radius: 12px; cursor: pointer; transition: all 0.15s; }
//     .tx-item:hover { background: #f9fafb; border-color: #e5e7eb; }
//     .tx-item.selected { background: #eff6ff; border-color: #3b82f6; }
//     .tx-left { display: flex; align-items: center; gap: 12px; }
//     .tx-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
//     .tx-icon.green { background: #dcfce7; color: #16a34a; }
//     .tx-icon.orange { background: #fef3c7; color: #d97706; }
//     .tx-icon.red { background: #fee2e2; color: #dc2626; }
//     .tx-icon.grey { background: #f3f4f6; color: #6b7280; }
//     .tx-meta { display: flex; flex-direction: column; gap: 2px; }
//     .tx-ref { font-weight: 600; font-size: 14px; color: #1a1a2e; }
//     .tx-desc { font-size: 12px; color: #6b7280; }
//     .tx-phone { font-size: 12px; color: #9ca3af; }
//     .tx-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
//     .tx-amount { font-weight: 700; color: #00a550; font-size: 15px; }
//     .tx-date { font-size: 11px; color: #9ca3af; }
//     .status-chip { padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 600; }
//     .status-chip.completed { background: #dcfce7; color: #166534; }
//     .status-chip.pending { background: #fef9c3; color: #713f12; }
//     .status-chip.failed { background: #fee2e2; color: #991b1b; }
//     .detail-panel { margin-top: 20px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb; }
//     .detail-panel h3 { margin: 0 0 16px; font-size: 15px; font-weight: 600; color: #374151; }
//     .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//     .detail-item { display: flex; flex-direction: column; gap: 4px; }
//     .d-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; }
//     .d-val { font-size: 14px; color: #1a1a2e; font-weight: 500; }
//     .d-val.mono { font-family: monospace; font-size: 12px; }
//     .empty-state { text-align: center; padding: 60px; color: #9ca3af; }
//     .empty-state mat-icon { font-size: 56px; width: 56px; height: 56px; color: #d1d5db; margin-bottom: 12px; display: block; }
//   `]
// })
// export class TransactionsComponent implements OnInit, OnDestroy {
//   transactions: MpesaTransaction[] = [];
//   selected: MpesaTransaction | null = null;
//   loading = false;
//   private destroy$ = new Subject<void>();

//   constructor(
//     private mpesaService: MpesaService,
//     private authService: AuthService,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void { this.load(); }
//   ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

//   load(): void {
//     const user = this.authService.currentUserValue;
//     if (!user) { this.snackBar.open('Please log in first', 'Close', { duration: 3000 }); return; }
//     this.loading = true;
//     this.mpesaService.getUserTransactions(user.id)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (res) => { this.transactions = res.data || []; this.loading = false; },
//         error: () => { this.loading = false; this.snackBar.open('Failed to load transactions', 'Close', { duration: 4000 }); }
//       });
//   }

//   select(tx: MpesaTransaction): void {
//     this.selected = this.selected?.id === tx.id ? null : tx;
//   }

//   statusIcon(status: string): string {
//     switch (status?.toLowerCase()) {
//       case 'completed': return 'check_circle';
//       case 'pending': return 'hourglass_empty';
//       case 'failed': return 'cancel';
//       default: return 'help_outline';
//     }
//   }

//   iconClass(status: string): string {
//     switch (status?.toLowerCase()) {
//       case 'completed': return 'green';
//       case 'pending': return 'orange';
//       case 'failed': return 'red';
//       default: return 'grey';
//     }
//   }
// }