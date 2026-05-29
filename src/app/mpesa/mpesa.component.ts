import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { Subject, takeUntil } from 'rxjs';
import { MpesaService, MpesaTransaction, STKPushRequest, TransactionStatus } from './mpesa.service';
import { AuthService } from '../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mpesa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  template: `
    <div class="mpesa-shell">

      <!-- Header -->
      <div class="mpesa-header">
        <div class="header-left">
          <div class="mpesa-logo">
            <span class="logo-m">M</span>
            <span class="logo-pesa">-PESA</span>
          </div>
          <div class="header-meta">
            <h1>Payment Gateway</h1>
            <p>Safaricom M-Pesa Integration</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-pill" [class.online]="configStatus === 'ok'" [class.offline]="configStatus === 'error'">
            <span class="dot"></span>
            {{ configStatus === 'ok' ? 'Gateway Online' : configStatus === 'error' ? 'Config Error' : 'Checking...' }}
          </div>
          <div class="stat-pill token" [class.valid]="tokenStatus === 'ok'" [class.invalid]="tokenStatus === 'error'">
            <mat-icon>vpn_key</mat-icon>
            {{ tokenStatus === 'ok' ? 'Token Valid' : tokenStatus === 'error' ? 'Token Failed' : 'Not Tested' }}
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Tabs -->
      <mat-tab-group class="mpesa-tabs" animationDuration="200ms" [(selectedIndex)]="activeTab">

        <!-- ── Tab 1: STK Push ── -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>phone_android</mat-icon>&nbsp; Pay via STK Push
          </ng-template>

          <div class="tab-content two-col">

            <!-- Form -->
            <mat-card class="form-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon green">send_to_mobile</mat-icon>
                <mat-card-title>Initiate STK Push</mat-card-title>
                <mat-card-subtitle>Send payment prompt to customer's phone</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="stkForm" (ngSubmit)="initiateSTKPush()" class="mpesa-form">

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Phone Number</mat-label>
                    <mat-icon matPrefix>phone</mat-icon>
                    <input matInput formControlName="phoneNumber" placeholder="254712345678">
                    <mat-hint>Format: 254XXXXXXXXX</mat-hint>
                    <mat-error *ngIf="stkForm.get('phoneNumber')?.hasError('required')">Phone number is required</mat-error>
                    <mat-error *ngIf="stkForm.get('phoneNumber')?.hasError('pattern')">Enter valid format: 254XXXXXXXXX</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Amount (KES)</mat-label>
                    <mat-icon matPrefix>payments</mat-icon>
                    <input matInput type="number" formControlName="amount" placeholder="100" min="1">
                    <span matSuffix>KES</span>
                    <mat-error *ngIf="stkForm.get('amount')?.hasError('required')">Amount is required</mat-error>
                    <mat-error *ngIf="stkForm.get('amount')?.hasError('min')">Minimum amount is KES 1</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Account Reference</mat-label>
                    <mat-icon matPrefix>tag</mat-icon>
                    <input matInput formControlName="accountReference" placeholder="INV-001">
                    <mat-error *ngIf="stkForm.get('accountReference')?.hasError('required')">Reference is required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Transaction Description</mat-label>
                    <mat-icon matPrefix>description</mat-icon>
                    <input matInput formControlName="transactionDesc" placeholder="Payment for services">
                    <mat-error *ngIf="stkForm.get('transactionDesc')?.hasError('required')">Description is required</mat-error>
                  </mat-form-field>

                  <div class="optional-fields">
                    <p class="optional-label">Optional Fields</p>
                    <div class="optional-row">
                      <mat-form-field appearance="outline">
                        <mat-label>User ID</mat-label>
                        <input matInput type="number" formControlName="userId" placeholder="e.g. 5">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>KPI ID</mat-label>
                        <input matInput type="number" formControlName="kpiId" placeholder="e.g. 12">
                      </mat-form-field>
                    </div>
                  </div>

                  <button mat-raised-button color="primary" type="submit"
                          class="submit-btn" [disabled]="stkForm.invalid || stkLoading">
                    <mat-spinner *ngIf="stkLoading" diameter="20"></mat-spinner>
                    <mat-icon *ngIf="!stkLoading">send</mat-icon>
                    {{ stkLoading ? 'Sending...' : 'Send STK Push' }}
                  </button>
                </form>
              </mat-card-content>
            </mat-card>

            <!-- Response -->
            <div class="response-col">
              <mat-card class="response-card" *ngIf="stkResponse">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="card-icon" [class.green]="stkResponse.success" [class.red]="!stkResponse.success">
                    {{ stkResponse.success ? 'check_circle' : 'error' }}
                  </mat-icon>
                  <mat-card-title>{{ stkResponse.success ? 'Request Sent!' : 'Request Failed' }}</mat-card-title>
                  <mat-card-subtitle>{{ stkResponse.customerMessage }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="response-grid">
                    <div class="resp-item">
                      <span class="resp-label">Merchant Request ID</span>
                      <span class="resp-val mono">{{ stkResponse.merchantRequestID }}</span>
                    </div>
                    <div class="resp-item">
                      <span class="resp-label">Checkout Request ID</span>
                      <span class="resp-val mono">{{ stkResponse.checkoutRequestID }}</span>
                    </div>
                    <div class="resp-item">
                      <span class="resp-label">Response Code</span>
                      <span class="resp-val">{{ stkResponse.responseCode }}</span>
                    </div>
                    <div class="resp-item">
                      <span class="resp-label">Response Description</span>
                      <span class="resp-val">{{ stkResponse.responseDescription }}</span>
                    </div>
                  </div>
                  <button mat-stroked-button class="full-width mt-16"
                          *ngIf="stkResponse.success && stkResponse.checkoutRequestID"
                          (click)="checkStatusFromCheckout(stkResponse.checkoutRequestID)">
                    <mat-icon>refresh</mat-icon> Check Payment Status
                  </button>
                </mat-card-content>
              </mat-card>

              <mat-card class="info-card" *ngIf="!stkResponse">
                <mat-card-content>
                  <div class="info-illustration">
                    <mat-icon>phone_in_talk</mat-icon>
                    <h3>How STK Push Works</h3>
                    <ol>
                      <li>Enter the customer's phone number and amount</li>
                      <li>Click "Send STK Push"</li>
                      <li>Customer receives a prompt on their phone</li>
                      <li>Customer enters their M-Pesa PIN</li>
                      <li>Payment is confirmed automatically</li>
                    </ol>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

          </div>
        </mat-tab>

        <!-- ── Tab 2: Transaction Status ── -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>search</mat-icon>&nbsp; Check Status
          </ng-template>

          <div class="tab-content two-col">

            <mat-card class="form-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon blue">manage_search</mat-icon>
                <mat-card-title>Transaction Lookup</mat-card-title>
                <mat-card-subtitle>Look up any transaction by ID or Checkout Request ID</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>

                <div class="lookup-section">
                  <p class="lookup-label">Lookup by Transaction ID</p>
                  <div class="lookup-row">
                    <mat-form-field appearance="outline" class="flex-grow">
                      <mat-label>Transaction ID</mat-label>
                      <mat-icon matPrefix>tag</mat-icon>
                      <input matInput type="number" [(ngModel)]="lookupTransactionId" placeholder="e.g. 42">
                    </mat-form-field>
                    <button mat-raised-button color="primary" (click)="getTransaction()" [disabled]="!lookupTransactionId || lookupLoading">
                      <mat-spinner *ngIf="lookupLoading" diameter="18"></mat-spinner>
                      <mat-icon *ngIf="!lookupLoading">search</mat-icon>
                      Search
                    </button>
                  </div>
                </div>

                <mat-divider class="my-16"></mat-divider>

                <div class="lookup-section">
                  <p class="lookup-label">Lookup by Checkout Request ID</p>
                  <div class="lookup-row">
                    <mat-form-field appearance="outline" class="flex-grow">
                      <mat-label>Checkout Request ID</mat-label>
                      <mat-icon matPrefix>receipt_long</mat-icon>
                      <input matInput [(ngModel)]="lookupCheckoutId" placeholder="ws_CO_...">
                    </mat-form-field>
                    <button mat-raised-button color="accent" (click)="getTransactionStatus()" [disabled]="!lookupCheckoutId || statusLoading">
                      <mat-spinner *ngIf="statusLoading" diameter="18"></mat-spinner>
                      <mat-icon *ngIf="!statusLoading">track_changes</mat-icon>
                      Check
                    </button>
                  </div>
                </div>

                <mat-divider class="my-16"></mat-divider>

                <div class="lookup-section">
                  <p class="lookup-label">My Transactions</p>
                  <button mat-stroked-button color="primary" class="full-width" (click)="getMyTransactions()" [disabled]="userTxLoading">
                    <mat-spinner *ngIf="userTxLoading" diameter="18"></mat-spinner>
                    <mat-icon *ngIf="!userTxLoading">history</mat-icon>
                    Load My Transaction History
                  </button>
                </div>

              </mat-card-content>
            </mat-card>

            <!-- Result Panel -->
            <div class="response-col">

              <!-- Single transaction result -->
              <mat-card class="response-card" *ngIf="transactionDetail">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="card-icon" [ngClass]="getStatusIconClass(transactionDetail.status)">
                    {{ getStatusIcon(transactionDetail.status) }}
                  </mat-icon>
                  <mat-card-title>Transaction #{{ transactionDetail.id }}</mat-card-title>
                  <mat-card-subtitle>
                    <span class="status-chip" [ngClass]="transactionDetail.status.toLowerCase()">
                      {{ transactionDetail.status }}
                    </span>
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="response-grid">
                    <div class="resp-item"><span class="resp-label">Phone</span><span class="resp-val">{{ transactionDetail.phoneNumber }}</span></div>
                    <div class="resp-item"><span class="resp-label">Amount</span><span class="resp-val amount">KES {{ transactionDetail.amount | number:'1.2-2' }}</span></div>
                    <div class="resp-item"><span class="resp-label">Receipt No.</span><span class="resp-val mono">{{ transactionDetail.mpesaReceiptNumber }}</span></div>
                    <div class="resp-item"><span class="resp-label">Account Ref</span><span class="resp-val">{{ transactionDetail.accountReference }}</span></div>
                    <div class="resp-item"><span class="resp-label">Result</span><span class="resp-val">{{ transactionDetail.resultDesc }}</span></div>
                    <div class="resp-item"><span class="resp-label">Date</span><span class="resp-val">{{ transactionDetail.transactionDate | date:'medium' }}</span></div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Status result -->
              <mat-card class="response-card" *ngIf="transactionStatus && !transactionDetail">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="card-icon" [ngClass]="getStatusIconClass(transactionStatus.status)">
                    {{ getStatusIcon(transactionStatus.status) }}
                  </mat-icon>
                  <mat-card-title>Payment Status</mat-card-title>
                  <mat-card-subtitle>
                    <span class="status-chip" [ngClass]="transactionStatus.status.toLowerCase()">
                      {{ transactionStatus.status }}
                    </span>
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="response-grid">
                    <div class="resp-item"><span class="resp-label">Phone</span><span class="resp-val">{{ transactionStatus.phoneNumber }}</span></div>
                    <div class="resp-item"><span class="resp-label">Amount</span><span class="resp-val amount">KES {{ transactionStatus.amount | number:'1.2-2' }}</span></div>
                    <div class="resp-item"><span class="resp-label">Receipt No.</span><span class="resp-val mono">{{ transactionStatus.mpesaReceiptNumber }}</span></div>
                    <div class="resp-item"><span class="resp-label">Account Ref</span><span class="resp-val">{{ transactionStatus.accountReference }}</span></div>
                    <div class="resp-item"><span class="resp-label">Result</span><span class="resp-val">{{ transactionStatus.resultDesc }}</span></div>
                    <div class="resp-item"><span class="resp-label">Date</span><span class="resp-val">{{ transactionStatus.transactionDate | date:'medium' }}</span></div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- User transactions list -->
              <mat-card class="response-card" *ngIf="userTransactions.length > 0">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="card-icon blue">receipt</mat-icon>
                  <mat-card-title>My Transactions ({{ userTransactions.length }})</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="tx-list">
                    <div class="tx-item" *ngFor="let tx of userTransactions" (click)="selectTransaction(tx)">
                      <div class="tx-left">
                        <mat-icon [ngClass]="getStatusIconClass(tx.status)">{{ getStatusIcon(tx.status) }}</mat-icon>
                        <div>
                          <span class="tx-ref">{{ tx.accountReference }}</span>
                          <span class="tx-desc">{{ tx.transactionDesc }}</span>
                        </div>
                      </div>
                      <div class="tx-right">
                        <span class="tx-amount">KES {{ tx.amount | number:'1.0-0' }}</span>
                        <span class="tx-date">{{ tx.createdAt | date:'shortDate' }}</span>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

            </div>
          </div>
        </mat-tab>

        <!-- ── Tab 3: All Transactions (Admin) ── -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>table_chart</mat-icon>&nbsp; All Transactions
          </ng-template>

          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon purple">admin_panel_settings</mat-icon>
                <mat-card-title>All Transactions — Admin View</mat-card-title>
                <mat-card-subtitle>Requires Admin role</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>

                <div class="filter-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Filter by Status</mat-label>
                    <mat-select [(ngModel)]="adminStatusFilter">
                      <mat-option value="">All</mat-option>
                      <mat-option value="Pending">Pending</mat-option>
                      <mat-option value="Completed">Completed</mat-option>
                      <mat-option value="Failed">Failed</mat-option>
                      <mat-option value="Cancelled">Cancelled</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Page Size</mat-label>
                    <mat-select [(ngModel)]="adminPageSize">
                      <mat-option [value]="10">10</mat-option>
                      <mat-option [value]="20">20</mat-option>
                      <mat-option [value]="50">50</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <button mat-raised-button color="primary" (click)="loadAllTransactions()" [disabled]="allTxLoading">
                    <mat-spinner *ngIf="allTxLoading" diameter="18"></mat-spinner>
                    <mat-icon *ngIf="!allTxLoading">refresh</mat-icon>
                    Load Transactions
                  </button>
                </div>

                <div class="table-wrapper" *ngIf="allTransactions.length > 0">
                  <table mat-table [dataSource]="allTransactions" class="mpesa-table">

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
                      <td mat-cell *matCellDef="let tx" class="mono">{{ tx.mpesaReceiptNumber }}</td>
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

                    <tr mat-header-row *matHeaderRowDef="adminColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: adminColumns;" class="table-row" (click)="selectTransaction(row)"></tr>
                  </table>

                  <div class="pagination-row">
                    <button mat-stroked-button [disabled]="adminPage <= 1" (click)="adminPage = adminPage - 1; loadAllTransactions()">
                      <mat-icon>chevron_left</mat-icon> Prev
                    </button>
                    <span class="page-info">Page {{ adminPage }}</span>
                    <button mat-stroked-button (click)="adminPage = adminPage + 1; loadAllTransactions()">
                      Next <mat-icon>chevron_right</mat-icon>
                    </button>
                  </div>
                </div>

                <div class="empty-state" *ngIf="allTransactions.length === 0 && !allTxLoading">
                  <mat-icon>receipt_long</mat-icon>
                  <p>Click "Load Transactions" to view all M-Pesa transactions</p>
                </div>

              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ── Tab 4: System Diagnostics ── -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>settings_suggest</mat-icon>&nbsp; Diagnostics
          </ng-template>

          <div class="tab-content two-col">

            <!-- Token Test -->
            <mat-card class="diag-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon" [class.green]="tokenStatus==='ok'" [class.red]="tokenStatus==='error'" [class.grey]="tokenStatus==='idle'">vpn_key</mat-icon>
                <mat-card-title>Auth Token Test</mat-card-title>
                <mat-card-subtitle>Verify M-Pesa access token generation</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <button mat-raised-button color="primary" class="full-width" (click)="testToken()" [disabled]="tokenLoading">
                  <mat-spinner *ngIf="tokenLoading" diameter="18"></mat-spinner>
                  <mat-icon *ngIf="!tokenLoading">play_arrow</mat-icon>
                  {{ tokenLoading ? 'Testing...' : 'Test Token Generation' }}
                </button>
                <div class="diag-result" *ngIf="tokenResult" [class.success]="tokenResult.success" [class.error]="!tokenResult.success">
                  <div class="diag-status">
                    <mat-icon>{{ tokenResult.success ? 'check_circle' : 'cancel' }}</mat-icon>
                    <strong>{{ tokenResult.message }}</strong>
                  </div>
                  <div class="diag-detail" *ngIf="tokenResult.success">
                    <span>Token Preview: <code>{{ tokenResult.tokenPreview }}</code></span>
                    <span>Length: {{ tokenResult.tokenLength }} chars</span>
                  </div>
                  <div class="diag-detail error-text" *ngIf="!tokenResult.success">
                    <span>{{ tokenResult.error }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Config Check -->
            <mat-card class="diag-card">
              <mat-card-header>
                <mat-icon mat-card-avatar class="card-icon" [class.green]="configStatus==='ok'" [class.red]="configStatus==='error'" [class.grey]="configStatus==='idle'">tune</mat-icon>
                <mat-card-title>Configuration Check</mat-card-title>
                <mat-card-subtitle>Verify Daraja API configuration</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <button mat-raised-button color="accent" class="full-width" (click)="checkConfig()" [disabled]="configLoading">
                  <mat-spinner *ngIf="configLoading" diameter="18"></mat-spinner>
                  <mat-icon *ngIf="!configLoading">fact_check</mat-icon>
                  {{ configLoading ? 'Checking...' : 'Check Configuration' }}
                </button>
                <div class="diag-result" *ngIf="configResult" [class.success]="configResult.success" [class.error]="!configResult.success">
                  <div class="config-grid" *ngIf="configResult.success">
                    <div class="config-item" [class.ok]="configResult.hasConsumerKey" [class.fail]="!configResult.hasConsumerKey">
                      <mat-icon>{{ configResult.hasConsumerKey ? 'check' : 'close' }}</mat-icon>
                      Consumer Key
                    </div>
                    <div class="config-item" [class.ok]="configResult.hasConsumerSecret" [class.fail]="!configResult.hasConsumerSecret">
                      <mat-icon>{{ configResult.hasConsumerSecret ? 'check' : 'close' }}</mat-icon>
                      Consumer Secret
                    </div>
                    <div class="config-item" [class.ok]="configResult.hasPasskey" [class.fail]="!configResult.hasPasskey">
                      <mat-icon>{{ configResult.hasPasskey ? 'check' : 'close' }}</mat-icon>
                      Passkey
                    </div>
                    <div class="config-item ok">
                      <mat-icon>check</mat-icon>
                      Environment: {{ configResult.environment }}
                    </div>
                    <div class="config-item ok">
                      <mat-icon>check</mat-icon>
                      Short Code: {{ configResult.businessShortCode }}
                    </div>
                    <div class="config-item ok">
                      <mat-icon>link</mat-icon>
                      Callback: {{ configResult.callbackUrl }}
                    </div>
                  </div>
                  <div class="diag-detail error-text" *ngIf="!configResult.success">
                    <span>{{ configResult.error }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700&display=swap');

    :host { font-family: 'Sora', sans-serif; display: block; }

    .mpesa-shell { padding: 24px; background: #f0f4f8; min-height: 100vh; }

    /* ── Header ── */
    .mpesa-header {
      display: flex; align-items: center; justify-content: space-between;
      background: white; padding: 20px 28px; border-radius: 16px;
      margin-bottom: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .header-left { display: flex; align-items: center; gap: 20px; }
    .mpesa-logo {
      background: #00a550;
      border-radius: 12px; padding: 10px 16px;
      display: flex; align-items: baseline; gap: 0;
    }
    .logo-m { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 22px; color: white; }
    .logo-pesa { font-family: 'Sora', sans-serif; font-weight: 300; font-size: 18px; color: rgba(255,255,255,0.85); }
    .header-meta h1 { margin: 0; font-size: 22px; font-weight: 600; color: #1a1a2e; }
    .header-meta p { margin: 2px 0 0; font-size: 13px; color: #6b7280; }
    .header-stats { display: flex; gap: 12px; align-items: center; }
    .stat-pill {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 16px; border-radius: 100px;
      font-size: 13px; font-weight: 500;
      background: #f3f4f6; color: #6b7280;
      transition: all 0.3s;
    }
    .stat-pill mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .stat-pill.online { background: #dcfce7; color: #166534; }
    .stat-pill.offline { background: #fee2e2; color: #991b1b; }
    .stat-pill.token.valid { background: #dbeafe; color: #1e40af; }
    .stat-pill.token.invalid { background: #fee2e2; color: #991b1b; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

    /* ── Tabs ── */
    .mpesa-tabs { background: transparent; }
    ::ng-deep .mpesa-tabs .mat-mdc-tab-header { background: white; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    ::ng-deep .mpesa-tabs .mdc-tab { font-family: 'Sora', sans-serif !important; font-weight: 500; }

    .tab-content { padding: 4px 0; }
    .two-col { display: grid; grid-template-columns: 420px 1fr; gap: 24px; align-items: start; }

    /* ── Cards ── */
    mat-card { border-radius: 16px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; overflow: hidden; }
    mat-card-header { padding: 20px 20px 0 !important; }

    .card-icon { border-radius: 10px !important; width: 40px !important; height: 40px !important;
      display: flex !important; align-items: center; justify-content: center;
      font-size: 22px !important; }
    .card-icon.green { background: #dcfce7; color: #16a34a; }
    .card-icon.blue { background: #dbeafe; color: #2563eb; }
    .card-icon.purple { background: #ede9fe; color: #7c3aed; }
    .card-icon.red { background: #fee2e2; color: #dc2626; }
    .card-icon.grey { background: #f3f4f6; color: #6b7280; }

    /* ── Form ── */
    .mpesa-form { display: flex; flex-direction: column; gap: 4px; padding: 16px 0; }
    .full-width { width: 100%; }
    .optional-label { font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 8px 0 4px; }
    .optional-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .submit-btn { height: 48px; font-size: 15px; font-weight: 600; border-radius: 10px !important; display: flex; align-items: center; gap: 8px; justify-content: center; margin-top: 8px; }

    /* ── Response ── */
    .response-col { display: flex; flex-direction: column; gap: 16px; }
    .response-card mat-card-content { padding: 16px 20px 20px !important; }
    .response-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
    .resp-item { display: flex; flex-direction: column; gap: 2px; }
    .resp-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
    .resp-val { font-size: 14px; color: #1a1a2e; font-weight: 500; }
    .resp-val.mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
    .resp-val.amount { font-size: 18px; font-weight: 700; color: #00a550; }

    .info-card { background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important; }
    .info-illustration { text-align: center; padding: 20px; }
    .info-illustration mat-icon { font-size: 48px; width: 48px; height: 48px; color: #0284c7; margin-bottom: 12px; }
    .info-illustration h3 { font-size: 16px; font-weight: 600; margin: 0 0 16px; color: #0c4a6e; }
    .info-illustration ol { text-align: left; color: #075985; font-size: 14px; line-height: 1.8; }

    /* ── Status Chips ── */
    .status-chip { padding: 4px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; display: inline-block; }
    .status-chip.completed, .status-chip.success { background: #dcfce7; color: #166534; }
    .status-chip.pending { background: #fef9c3; color: #713f12; }
    .status-chip.failed { background: #fee2e2; color: #991b1b; }
    .status-chip.cancelled { background: #f3f4f6; color: #4b5563; }

    /* ── Lookup ── */
    .lookup-section { margin-bottom: 4px; }
    .lookup-label { font-size: 13px; font-weight: 600; color: #374151; margin: 0 0 8px; }
    .lookup-row { display: flex; gap: 12px; align-items: flex-start; }
    .flex-grow { flex: 1; }
    .my-16 { margin: 16px 0; }

    /* ── Transaction List ── */
    .tx-list { display: flex; flex-direction: column; max-height: 400px; overflow-y: auto; }
    .tx-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 8px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.15s; border-radius: 8px; }
    .tx-item:hover { background: #f9fafb; }
    .tx-left { display: flex; align-items: center; gap: 12px; }
    .tx-ref { display: block; font-weight: 600; font-size: 14px; color: #1a1a2e; }
    .tx-desc { display: block; font-size: 12px; color: #6b7280; }
    .tx-right { text-align: right; }
    .tx-amount { display: block; font-weight: 700; color: #00a550; }
    .tx-date { display: block; font-size: 11px; color: #9ca3af; }

    /* ── Admin Table ── */
    .filter-row { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 16px; padding: 16px 20px 0; }
    .table-wrapper { overflow-x: auto; }
    .mpesa-table { width: 100%; }
    .mpesa-table th { background: #f8fafc; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    .mpesa-table .table-row { cursor: pointer; transition: background 0.15s; }
    .mpesa-table .table-row:hover { background: #f0f9ff; }
    .amount-cell { font-weight: 700; color: #00a550; }
    .mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
    .pagination-row { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 16px; }
    .page-info { font-weight: 600; color: #374151; }

    .empty-state { text-align: center; padding: 60px; color: #9ca3af; }
    .empty-state mat-icon { font-size: 56px; width: 56px; height: 56px; color: #d1d5db; margin-bottom: 12px; }

    /* ── Diagnostics ── */
    .diag-card mat-card-content { padding: 16px 20px 20px !important; }
    .diag-result { margin-top: 16px; padding: 16px; border-radius: 12px; }
    .diag-result.success { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .diag-result.error { background: #fef2f2; border: 1px solid #fecaca; }
    .diag-status { display: flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 12px; }
    .diag-result.success .diag-status { color: #166534; }
    .diag-result.error .diag-status { color: #991b1b; }
    .diag-detail { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: #4b5563; }
    .diag-detail code { font-family: 'IBM Plex Mono', monospace; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; }
    .error-text { color: #dc2626; }
    .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .config-item { display: flex; align-items: center; gap: 6px; font-size: 13px; padding: 6px 8px; border-radius: 8px; }
    .config-item.ok { background: #dcfce7; color: #166534; }
    .config-item.fail { background: #fee2e2; color: #991b1b; }
    .mt-16 { margin-top: 16px; }

    @media (max-width: 900px) {
      .two-col { grid-template-columns: 1fr; }
      .mpesa-header { flex-direction: column; gap: 16px; align-items: flex-start; }
    }
  `]
})
export class MpesaComponent implements OnInit, OnDestroy {
  activeTab = 0;
  private destroy$ = new Subject<void>();

  // STK Push
  stkForm!: FormGroup;
  stkLoading = false;
  stkResponse: any = null;

  // Lookup
  lookupTransactionId: number | null = null;
  lookupCheckoutId = '';
  lookupLoading = false;
  statusLoading = false;
  userTxLoading = false;
  transactionDetail: MpesaTransaction | null = null;
  transactionStatus: TransactionStatus | null = null;
  userTransactions: MpesaTransaction[] = [];

  // Admin
  allTransactions: MpesaTransaction[] = [];
  allTxLoading = false;
  adminColumns = ['id', 'phone', 'amount', 'reference', 'receipt', 'status', 'date'];
  adminStatusFilter = '';
  adminPageSize = 20;
  adminPage = 1;

  // Diagnostics
  tokenLoading = false;
  tokenResult: any = null;
  tokenStatus: 'idle' | 'ok' | 'error' = 'idle';
  configLoading = false;
  configResult: any = null;
  configStatus: 'idle' | 'ok' | 'error' = 'idle';

  constructor(
    private fb: FormBuilder,
    private mpesaService: MpesaService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = parseInt(params['tab'] ?? '0', 10);
      this.activeTab = isNaN(tab) ? 0 : tab;
    });
    this.stkForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^254[0-9]{9}$/)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      accountReference: ['', Validators.required],
      transactionDesc: ['', Validators.required],
      userId: [null],
      kpiId: [null]
    });
    // Auto-fill userId from logged-in user
    const user = this.authService.currentUserValue;
    if (user) this.stkForm.patchValue({ userId: user.id });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  initiateSTKPush(): void {
    if (this.stkForm.invalid) return;
    this.stkLoading = true;
    this.stkResponse = null;
    const val = this.stkForm.value;
    const payload: STKPushRequest = {
      phoneNumber: val.phoneNumber,
      amount: val.amount,
      accountReference: val.accountReference,
      transactionDesc: val.transactionDesc,
      ...(val.userId && { userId: val.userId }),
      ...(val.kpiId && { kpiId: val.kpiId })
    };
    this.mpesaService.initiateSTKPush(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.stkResponse = res; this.stkLoading = false; this.notify(res.success ? 'STK Push sent successfully!' : 'STK Push failed', res.success ? 'success' : 'error'); },
        error: (err) => { this.stkLoading = false; this.stkResponse = { success: false, customerMessage: err.error?.message || 'Request failed' }; this.notify('Failed to send STK Push', 'error'); }
      });
  }

  getTransaction(): void {
    if (!this.lookupTransactionId) return;
    this.lookupLoading = true;
    this.transactionDetail = null;
    this.mpesaService.getTransaction(this.lookupTransactionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.transactionDetail = res.data; this.lookupLoading = false; },
        error: (err) => { this.lookupLoading = false; this.notify(err.error?.message || 'Transaction not found', 'error'); }
      });
  }

  getTransactionStatus(): void {
    if (!this.lookupCheckoutId.trim()) return;
    this.statusLoading = true;
    this.transactionStatus = null;
    this.transactionDetail = null;
    this.mpesaService.getTransactionStatus(this.lookupCheckoutId.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.transactionStatus = res.data; this.statusLoading = false; },
        error: (err) => { this.statusLoading = false; this.notify(err.error?.message || 'Status lookup failed', 'error'); }
      });
  }

  checkStatusFromCheckout(checkoutId: string): void {
    this.lookupCheckoutId = checkoutId;
    this.activeTab = 1;
    setTimeout(() => this.getTransactionStatus(), 100);
  }

  getMyTransactions(): void {
    const user = this.authService.currentUserValue;
    if (!user) { this.notify('Please log in to view your transactions', 'error'); return; }
    this.userTxLoading = true;
    this.userTransactions = [];
    this.mpesaService.getUserTransactions(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.userTransactions = res.data; this.userTxLoading = false; },
        error: (err) => { this.userTxLoading = false; this.notify('Failed to load transactions', 'error'); }
      });
  }

  selectTransaction(tx: MpesaTransaction): void {
    this.transactionDetail = tx;
    this.transactionStatus = null;
  }

  loadAllTransactions(): void {
    this.allTxLoading = true;
    this.mpesaService.getAllTransactions(this.adminPage, this.adminPageSize, this.adminStatusFilter || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.allTransactions = res.data || []; this.allTxLoading = false; },
        error: (err) => { this.allTxLoading = false; this.notify(err.error?.message || 'Access denied — Admin role required', 'error'); }
      });
  }

  testToken(): void {
    this.tokenLoading = true;
    this.tokenResult = null;
    this.mpesaService.testToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.tokenResult = res; this.tokenStatus = res.success ? 'ok' : 'error'; this.tokenLoading = false; },
        error: (err) => { this.tokenResult = { success: false, error: err.error?.error || 'Token test failed' }; this.tokenStatus = 'error'; this.tokenLoading = false; }
      });
  }

  checkConfig(): void {
    this.configLoading = true;
    this.configResult = null;
    this.mpesaService.checkConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.configResult = res; this.configStatus = res.success ? 'ok' : 'error'; this.configLoading = false; },
        error: (err) => { this.configResult = { success: false, error: err.error?.error || 'Config check failed' }; this.configStatus = 'error'; this.configLoading = false; }
      });
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'check_circle';
      case 'pending': return 'hourglass_empty';
      case 'failed': return 'cancel';
      default: return 'help_outline';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      default: return 'grey';
    }
  }

  private notify(msg: string, type: 'success' | 'error'): void {
    this.snackBar.open(msg, 'Close', {
      duration: 4000,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}