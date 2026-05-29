import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { MpesaService, MpesaTransaction } from '../mpesa.service';

@Component({
  selector: 'app-all-transactions',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatSelectModule,
    MatTableModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="all-tx-shell">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar class="card-icon purple">admin_panel_settings</mat-icon>
          <mat-card-title>All Transactions — Admin View</mat-card-title>
          <mat-card-subtitle>Full transaction history across all users</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>

          <div class="filter-row">
            <mat-form-field appearance="outline">
              <mat-label>Filter by Status</mat-label>
              <mat-select [(ngModel)]="statusFilter">
                <mat-option value="">All</mat-option>
                <mat-option value="Pending">Pending</mat-option>
                <mat-option value="Completed">Completed</mat-option>
                <mat-option value="Failed">Failed</mat-option>
                <mat-option value="Cancelled">Cancelled</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Page Size</mat-label>
              <mat-select [(ngModel)]="pageSize">
                <mat-option [value]="10">10</mat-option>
                <mat-option [value]="20">20</mat-option>
                <mat-option [value]="50">50</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="load()" [disabled]="loading">
              <mat-spinner *ngIf="loading" diameter="18"></mat-spinner>
              <mat-icon *ngIf="!loading">refresh</mat-icon>
              {{ loading ? 'Loading...' : 'Load Transactions' }}
            </button>
          </div>

          <div class="table-wrapper" *ngIf="transactions.length > 0">
            <table mat-table [dataSource]="transactions" class="mpesa-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>#</th>
                <td mat-cell *matCellDef="let tx">{{ tx.id }}</td>
              </ng-container>
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let tx">{{ tx.phoneNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let tx" class="amount-cell">KES {{ tx.amount | number:'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="reference">
                <th mat-header-cell *matHeaderCellDef>Reference</th>
                <td mat-cell *matCellDef="let tx">{{ tx.accountReference }}</td>
              </ng-container>
              <ng-container matColumnDef="receipt">
                <th mat-header-cell *matHeaderCellDef>Receipt</th>
                <td mat-cell *matCellDef="let tx" class="mono">{{ tx.mpesaReceiptNumber || '—' }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let tx">
                  <span class="status-chip" [ngClass]="tx.status?.toLowerCase()">{{ tx.status }}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let tx">{{ tx.createdAt | date:'short' }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>
            </table>

            <div class="pagination-row">
              <button mat-stroked-button [disabled]="page <= 1" (click)="page = page - 1; load()">
                <mat-icon>chevron_left</mat-icon> Prev
              </button>
              <span class="page-info">Page {{ page }}</span>
              <button mat-stroked-button (click)="page = page + 1; load()">
                Next <mat-icon>chevron_right</mat-icon>
              </button>
            </div>
          </div>

          <div class="empty-state" *ngIf="transactions.length === 0 && !loading">
            <mat-icon>receipt_long</mat-icon>
            <p>Click "Load Transactions" to view all M-Pesa transactions</p>
          </div>

        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .all-tx-shell { padding: 4px 0; }
    mat-card { border-radius: 16px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; }
    mat-card-header { padding: 20px 20px 0 !important; }
    .card-icon { border-radius: 10px !important; width: 40px !important; height: 40px !important; display: flex !important; align-items: center; justify-content: center; font-size: 22px !important; }
    .card-icon.purple { background: #ede9fe; color: #7c3aed; }
    .filter-row { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; padding: 16px 0; }
    .table-wrapper { overflow-x: auto; }
    .mpesa-table { width: 100%; }
    .mpesa-table th { background: #f8fafc; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    .table-row { cursor: pointer; transition: background 0.15s; }
    .table-row:hover { background: #f0f9ff; }
    .amount-cell { font-weight: 700; color: #00a550; }
    .mono { font-family: monospace; font-size: 12px; }
    .status-chip { padding: 4px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; display: inline-block; }
    .status-chip.completed { background: #dcfce7; color: #166534; }
    .status-chip.pending { background: #fef9c3; color: #713f12; }
    .status-chip.failed { background: #fee2e2; color: #991b1b; }
    .status-chip.cancelled { background: #f3f4f6; color: #4b5563; }
    .pagination-row { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 16px; }
    .page-info { font-weight: 600; color: #374151; }
    .empty-state { text-align: center; padding: 60px; color: #9ca3af; }
    .empty-state mat-icon { font-size: 56px; width: 56px; height: 56px; color: #d1d5db; margin-bottom: 12px; display: block; }
  `]
})
export class AllTransactionsComponent implements OnInit, OnDestroy {
  transactions: MpesaTransaction[] = [];
  loading = false;
  columns = ['id', 'phone', 'amount', 'reference', 'receipt', 'status', 'date'];
  statusFilter = '';
  pageSize = 20;
  page = 1;
  private destroy$ = new Subject<void>();

  constructor(private mpesaService: MpesaService, private snackBar: MatSnackBar) {}

  ngOnInit(): void { this.load(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  load(): void {
    this.loading = true;
    this.mpesaService.getAllTransactions(this.page, this.pageSize, this.statusFilter || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.transactions = res.data || []; this.loading = false; },
        error: (err) => { this.loading = false; this.snackBar.open(err.error?.message || 'Access denied — Admin role required', 'Close', { duration: 4000 }); }
      });
  }
}