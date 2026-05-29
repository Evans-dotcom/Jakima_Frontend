import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { MpesaService } from '../mpesa.service';

@Component({
  selector: 'app-diagnostics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="diag-shell two-col">

      <!-- Token Test -->
      <mat-card class="diag-card">
        <mat-card-header>
          <mat-icon mat-card-avatar class="card-icon"
            [class.green]="tokenStatus==='ok'" [class.red]="tokenStatus==='error'" [class.grey]="tokenStatus==='idle'">
            vpn_key
          </mat-icon>
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
          <mat-icon mat-card-avatar class="card-icon"
            [class.green]="configStatus==='ok'" [class.red]="configStatus==='error'" [class.grey]="configStatus==='idle'">
            tune
          </mat-icon>
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
                <mat-icon>{{ configResult.hasConsumerKey ? 'check' : 'close' }}</mat-icon> Consumer Key
              </div>
              <div class="config-item" [class.ok]="configResult.hasConsumerSecret" [class.fail]="!configResult.hasConsumerSecret">
                <mat-icon>{{ configResult.hasConsumerSecret ? 'check' : 'close' }}</mat-icon> Consumer Secret
              </div>
              <div class="config-item" [class.ok]="configResult.hasPasskey" [class.fail]="!configResult.hasPasskey">
                <mat-icon>{{ configResult.hasPasskey ? 'check' : 'close' }}</mat-icon> Passkey
              </div>
              <div class="config-item ok">
                <mat-icon>check</mat-icon> Environment: {{ configResult.environment }}
              </div>
              <div class="config-item ok">
                <mat-icon>check</mat-icon> Short Code: {{ configResult.businessShortCode }}
              </div>
              <div class="config-item ok">
                <mat-icon>link</mat-icon> Callback: {{ configResult.callbackUrl }}
              </div>
            </div>
            <div class="diag-detail error-text" *ngIf="!configResult.success">
              <span>{{ configResult.error }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

    </div>
  `,
  styles: [`
    .diag-shell { padding: 4px 0; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
    mat-card { border-radius: 16px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; }
    mat-card-header { padding: 20px 20px 0 !important; }
    .card-icon { border-radius: 10px !important; width: 40px !important; height: 40px !important; display: flex !important; align-items: center; justify-content: center; font-size: 22px !important; }
    .card-icon.green { background: #dcfce7; color: #16a34a; }
    .card-icon.red { background: #fee2e2; color: #dc2626; }
    .card-icon.grey { background: #f3f4f6; color: #6b7280; }
    .diag-card mat-card-content { padding: 16px 20px 20px !important; }
    .full-width { width: 100%; margin-top: 16px; }
    .diag-result { margin-top: 16px; padding: 16px; border-radius: 12px; }
    .diag-result.success { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .diag-result.error { background: #fef2f2; border: 1px solid #fecaca; }
    .diag-status { display: flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 12px; }
    .diag-result.success .diag-status { color: #166534; }
    .diag-result.error .diag-status { color: #991b1b; }
    .diag-detail { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: #4b5563; }
    .diag-detail code { font-family: monospace; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; }
    .error-text { color: #dc2626; }
    .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .config-item { display: flex; align-items: center; gap: 6px; font-size: 13px; padding: 6px 8px; border-radius: 8px; }
    .config-item.ok { background: #dcfce7; color: #166534; }
    .config-item.fail { background: #fee2e2; color: #991b1b; }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
  `]
})
export class DiagnosticsComponent implements OnDestroy {
  tokenLoading = false;
  tokenResult: any = null;
  tokenStatus: 'idle' | 'ok' | 'error' = 'idle';
  configLoading = false;
  configResult: any = null;
  configStatus: 'idle' | 'ok' | 'error' = 'idle';
  private destroy$ = new Subject<void>();

  constructor(private mpesaService: MpesaService) {}

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  testToken(): void {
    this.tokenLoading = true;
    this.tokenResult = null;
    this.mpesaService.testToken().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => { this.tokenResult = res; this.tokenStatus = res.success ? 'ok' : 'error'; this.tokenLoading = false; },
      error: (err) => { this.tokenResult = { success: false, error: err.error?.error || 'Token test failed' }; this.tokenStatus = 'error'; this.tokenLoading = false; }
    });
  }

  checkConfig(): void {
    this.configLoading = true;
    this.configResult = null;
    this.mpesaService.checkConfig().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => { this.configResult = res; this.configStatus = res.success ? 'ok' : 'error'; this.configLoading = false; },
      error: (err) => { this.configResult = { success: false, error: err.error?.error || 'Config check failed' }; this.configStatus = 'error'; this.configLoading = false; }
    });
  }
}