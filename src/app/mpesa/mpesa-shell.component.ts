import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mpesa-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatIconModule
  ],
  template: `
    <div class="mpesa-shell">
      <div class="mpesa-header">
        <div class="header-left">
          <div class="mpesa-logo">
            <span class="logo-m">M</span>
            <span class="logo-pesa">-PESA</span>
          </div>
          <div class="header-meta">
            <h1>M-Pesa Payment Gateway</h1>
            <p>Safaricom Daraja API Integration</p>
          </div>
        </div>
      </div>

      <mat-tab-group
        class="mpesa-tabs"
        [selectedIndex]="activeTab"
        (selectedIndexChange)="onTabChange($event)"
        animationDuration="200ms"
      >
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>phone_android</mat-icon>&nbsp; STK Push
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>search</mat-icon>&nbsp; Check Status
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>history</mat-icon>&nbsp; My Transactions
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>table_chart</mat-icon>&nbsp; All Transactions
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>settings_suggest</mat-icon>&nbsp; Diagnostics
          </ng-template>
        </mat-tab>
      </mat-tab-group>

      <div class="tab-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .mpesa-shell { padding: 0; }
    .mpesa-header {
      background: white; padding: 20px 28px; border-radius: 16px;
      margin-bottom: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .header-left { display: flex; align-items: center; gap: 20px; }
    .mpesa-logo {
      background: #00a550; border-radius: 12px; padding: 10px 16px;
      display: flex; align-items: baseline;
    }
    .logo-m { font-weight: 700; font-size: 22px; color: white; }
    .logo-pesa { font-weight: 300; font-size: 18px; color: rgba(255,255,255,0.85); }
    .header-meta h1 { margin: 0; font-size: 22px; font-weight: 600; color: #1a1a2e; }
    .header-meta p { margin: 2px 0 0; font-size: 13px; color: #6b7280; }
    .mpesa-tabs { background: transparent; }
    ::ng-deep .mpesa-tabs .mat-mdc-tab-header {
      background: white; border-radius: 12px;
      margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .tab-content { margin-top: 4px; }
  `]
})
export class MpesaShellComponent implements OnInit, OnDestroy {

  // Fixed integer — NOT a getter
  activeTab = 0;

  private navigating = false; // Guard flag to prevent loop
  private destroy$ = new Subject<void>();

  private readonly tabRoutes = [
    '/mpesa/stk-push',
    '/mpesa/status',
    '/mpesa/transactions',
    '/mpesa/all-transactions',
    '/mpesa/diagnostics'
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Sync tab index when route changes (e.g. browser back/forward, sidebar links)
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((e: any) => {
      this.activeTab = this.urlToTab(e.urlAfterRedirects || e.url);
    });

    // Set correct tab on first load
    this.activeTab = this.urlToTab(this.router.url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange(index: number): void {
    // Skip if this change was triggered by our own navigation (prevents loop)
    if (this.navigating) return;
    if (index === this.activeTab) return; // Already on this tab

    this.navigating = true;
    this.activeTab = index;
    this.router.navigate([this.tabRoutes[index]]).finally(() => {
      this.navigating = false;
    });
  }

  private urlToTab(url: string): number {
    if (url.includes('all-transactions')) return 3; // Must check BEFORE 'transactions'
    if (url.includes('stk-push')) return 0;
    if (url.includes('status')) return 1;
    if (url.includes('transactions')) return 2;
    if (url.includes('diagnostics')) return 4;
    return 0;
  }
}