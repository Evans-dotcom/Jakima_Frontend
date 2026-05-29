import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MpesaService, TransactionStatus } from '../mpesa.service';

@Component({
  selector: 'app-transaction-status',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatDividerModule, MatSnackBarModule
  ],
  template: `
    <div class="status-shell two-col">

      <mat-card class="form-card">
        <mat-card-header>
          <mat-icon mat-card-avatar class="card-icon blue">manage_search</mat-icon>
          <mat-card-title>Transaction Lookup</mat-card-title>
          <mat-card-subtitle>Look up by Checkout Request ID</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>

          <div class="lookup-section">
            <p class="lookup-label">Checkout Request ID</p>
            <div class="lookup-row">
              <mat-form-field appearance="outline" class="flex-grow">
                <mat-label>e.g. ws_CO_...</mat-label>
                <mat-icon matPrefix>receipt_long</mat-icon>
                <input matInput [(ngModel)]="checkoutId" placeholder="ws_CO_...">
              </mat-form-field>
              <button mat-raised-button color="primary"
                      (click)="checkStatus()" [disabled]="!checkoutId || loading">
                <mat-spinner *ngIf="loading" diameter="18"></mat-spinner>
                <mat-icon *ngIf="!loading">track_changes</mat-icon>
                Check
              </button>
            </div>
          </div>

        </mat-card-content>
      </mat-card>

      <!-- Result -->
      <div class="response-col">
        <mat-card class="response-card" *ngIf="result">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon" [ngClass]="iconClass(result.status)">
              {{ statusIcon(result.status) }}
            </mat-icon>
            <mat-card-title>Payment Status</mat-card-title>
            <mat-card-subtitle>
              <span class="status-chip" [ngClass]="result.status.toLowerCase()">{{ result.status }}</span>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="response-grid">
              <div class="resp-item"><span class="resp-label">Phone</span><span class="resp-val">{{ result.phoneNumber }}</span></div>
              <div class="resp-item"><span class="resp-label">Amount</span><span class="resp-val amount">KES {{ result.amount | number:'1.2-2' }}</span></div>
              <div class="resp-item"><span class="resp-label">Receipt No.</span><span class="resp-val mono">{{ result.mpesaReceiptNumber }}</span></div>
              <div class="resp-item"><span class="resp-label">Account Ref</span><span class="resp-val">{{ result.accountReference }}</span></div>
              <div class="resp-item"><span class="resp-label">Result</span><span class="resp-val">{{ result.resultDesc }}</span></div>
              <div class="resp-item"><span class="resp-label">Date</span><span class="resp-val">{{ result.transactionDate | date:'medium' }}</span></div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="info-card" *ngIf="!result">
          <mat-card-content>
            <div class="info-illustration">
              <mat-icon>manage_search</mat-icon>
              <h3>Enter a Checkout Request ID</h3>
              <p>Paste the checkout ID from your STK Push response to check the current payment status.</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .status-shell { padding: 4px 0; }
    .two-col { display: grid; grid-template-columns: 420px 1fr; gap: 24px; align-items: start; }
    mat-card { border-radius: 16px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; }
    mat-card-header { padding: 20px 20px 0 !important; }
    .card-icon { border-radius: 10px !important; width: 40px !important; height: 40px !important; display: flex !important; align-items: center; justify-content: center; font-size: 22px !important; }
    .card-icon.blue { background: #dbeafe; color: #2563eb; }
    .card-icon.green { background: #dcfce7; color: #16a34a; }
    .card-icon.red { background: #fee2e2; color: #dc2626; }
    .card-icon.orange { background: #fef3c7; color: #d97706; }
    .card-icon.grey { background: #f3f4f6; color: #6b7280; }
    .lookup-section { padding: 16px 0 8px; }
    .lookup-label { font-size: 13px; font-weight: 600; color: #374151; margin: 0 0 8px; }
    .lookup-row { display: flex; gap: 12px; align-items: flex-start; }
    .flex-grow { flex: 1; }
    .response-col { display: flex; flex-direction: column; gap: 16px; }
    .response-card mat-card-content { padding: 16px 20px 20px !important; }
    .response-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
    .resp-item { display: flex; flex-direction: column; gap: 2px; }
    .resp-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; }
    .resp-val { font-size: 14px; color: #1a1a2e; font-weight: 500; }
    .resp-val.mono { font-family: monospace; font-size: 12px; }
    .resp-val.amount { font-size: 18px; font-weight: 700; color: #00a550; }
    .status-chip { padding: 4px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; display: inline-block; }
    .status-chip.completed { background: #dcfce7; color: #166534; }
    .status-chip.pending { background: #fef9c3; color: #713f12; }
    .status-chip.failed { background: #fee2e2; color: #991b1b; }
    .info-card { background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important; }
    .info-illustration { text-align: center; padding: 32px 20px; }
    .info-illustration mat-icon { font-size: 48px; width: 48px; height: 48px; color: #0284c7; margin-bottom: 12px; }
    .info-illustration h3 { font-size: 16px; font-weight: 600; color: #0c4a6e; margin: 0 0 8px; }
    .info-illustration p { color: #075985; font-size: 14px; }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
  `]
})
export class TransactionStatusComponent implements OnInit, OnDestroy {
  checkoutId = '';
  loading = false;
  result: TransactionStatus | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private mpesaService: MpesaService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Auto-fill if coming from STK Push page
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.checkoutId = params['id'];
        this.checkStatus();
      }
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  checkStatus(): void {
    if (!this.checkoutId.trim()) return;
    this.loading = true;
    this.result = null;
    this.mpesaService.getTransactionStatus(this.checkoutId.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.result = res.data; this.loading = false; },
        error: (err) => { this.loading = false; this.snackBar.open(err.error?.message || 'Status lookup failed', 'Close', { duration: 4000 }); }
      });
  }

  statusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'check_circle';
      case 'pending': return 'hourglass_empty';
      case 'failed': return 'cancel';
      default: return 'help_outline';
    }
  }

  iconClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      default: return 'grey';
    }
  }
}