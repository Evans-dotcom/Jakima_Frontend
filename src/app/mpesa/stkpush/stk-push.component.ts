// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { Subject, takeUntil } from 'rxjs';
// import { Router } from '@angular/router';
// import { MpesaService, STKPushRequest } from '../mpesa.service';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-stk-push',
//   standalone: true,
//   imports: [
//     CommonModule, FormsModule, ReactiveFormsModule,
//     MatCardModule, MatButtonModule, MatIconModule,
//     MatFormFieldModule, MatInputModule,
//     MatProgressSpinnerModule, MatSnackBarModule
//   ],
//   template: `
//     <div class="stk-shell">
//       <div class="two-col">

//         <!-- Form Card -->
//         <mat-card class="form-card">
//           <mat-card-header>
//             <mat-icon mat-card-avatar class="card-icon green">send_to_mobile</mat-icon>
//             <mat-card-title>Initiate STK Push</mat-card-title>
//             <mat-card-subtitle>Send payment prompt to customer's phone</mat-card-subtitle>
//           </mat-card-header>
//           <mat-card-content>
//             <form [formGroup]="stkForm" (ngSubmit)="initiateSTKPush()" class="mpesa-form">

//               <mat-form-field appearance="outline" class="full-width">
//                 <mat-label>Phone Number</mat-label>
//                 <mat-icon matPrefix>phone</mat-icon>
//                 <input matInput formControlName="phoneNumber" placeholder="254712345678">
//                 <mat-hint>Format: 254XXXXXXXXX</mat-hint>
//                 <mat-error *ngIf="stkForm.get('phoneNumber')?.hasError('required')">Phone number is required</mat-error>
//                 <mat-error *ngIf="stkForm.get('phoneNumber')?.hasError('pattern')">Enter valid format: 254XXXXXXXXX</mat-error>
//               </mat-form-field>

//               <mat-form-field appearance="outline" class="full-width">
//                 <mat-label>Amount (KES)</mat-label>
//                 <mat-icon matPrefix>payments</mat-icon>
//                 <input matInput type="number" formControlName="amount" placeholder="100" min="1">
//                 <span matSuffix>KES</span>
//                 <mat-error *ngIf="stkForm.get('amount')?.hasError('required')">Amount is required</mat-error>
//                 <mat-error *ngIf="stkForm.get('amount')?.hasError('min')">Minimum amount is KES 1</mat-error>
//               </mat-form-field>

//               <mat-form-field appearance="outline" class="full-width">
//                 <mat-label>Account Reference</mat-label>
//                 <mat-icon matPrefix>tag</mat-icon>
//                 <input matInput formControlName="accountReference" placeholder="INV-001">
//                 <mat-error *ngIf="stkForm.get('accountReference')?.hasError('required')">Reference is required</mat-error>
//               </mat-form-field>

//               <mat-form-field appearance="outline" class="full-width">
//                 <mat-label>Transaction Description</mat-label>
//                 <mat-icon matPrefix>description</mat-icon>
//                 <input matInput formControlName="transactionDesc" placeholder="Payment for services">
//                 <mat-error *ngIf="stkForm.get('transactionDesc')?.hasError('required')">Description is required</mat-error>
//               </mat-form-field>

//               <button mat-raised-button color="primary" type="submit"
//                       class="submit-btn" [disabled]="stkForm.invalid || stkLoading">
//                 <mat-spinner *ngIf="stkLoading" diameter="20"></mat-spinner>
//                 <mat-icon *ngIf="!stkLoading">send</mat-icon>
//                 {{ stkLoading ? 'Sending...' : 'Send STK Push' }}
//               </button>
//             </form>
//           </mat-card-content>
//         </mat-card>

//         <!-- Response / Info Panel -->
//         <div class="response-col">
//           <mat-card class="response-card" *ngIf="stkResponse">
//             <mat-card-header>
//               <mat-icon mat-card-avatar class="card-icon"
//                 [class.green]="stkResponse.success" [class.red]="!stkResponse.success">
//                 {{ stkResponse.success ? 'check_circle' : 'error' }}
//               </mat-icon>
//               <mat-card-title>{{ stkResponse.success ? 'Request Sent!' : 'Request Failed' }}</mat-card-title>
//               <mat-card-subtitle>{{ stkResponse.customerMessage }}</mat-card-subtitle>
//             </mat-card-header>
//             <mat-card-content>
//               <div class="response-grid">
//                 <div class="resp-item">
//                   <span class="resp-label">Merchant Request ID</span>
//                   <span class="resp-val mono">{{ stkResponse.merchantRequestID }}</span>
//                 </div>
//                 <div class="resp-item">
//                   <span class="resp-label">Checkout Request ID</span>
//                   <span class="resp-val mono">{{ stkResponse.checkoutRequestID }}</span>
//                 </div>
//                 <div class="resp-item">
//                   <span class="resp-label">Response Code</span>
//                   <span class="resp-val">{{ stkResponse.responseCode }}</span>
//                 </div>
//                 <div class="resp-item">
//                   <span class="resp-label">Description</span>
//                   <span class="resp-val">{{ stkResponse.responseDescription }}</span>
//                 </div>
//               </div>
//               <button mat-stroked-button class="full-width mt-16"
//                       *ngIf="stkResponse.success && stkResponse.checkoutRequestID"
//                       (click)="goCheckStatus(stkResponse.checkoutRequestID)">
//                 <mat-icon>refresh</mat-icon> Check Payment Status
//               </button>
//             </mat-card-content>
//           </mat-card>

//           <mat-card class="info-card" *ngIf="!stkResponse">
//             <mat-card-content>
//               <div class="info-illustration">
//                 <mat-icon>phone_in_talk</mat-icon>
//                 <h3>How STK Push Works</h3>
//                 <ol>
//                   <li>Enter the customer's phone number and amount</li>
//                   <li>Click "Send STK Push"</li>
//                   <li>Customer receives a prompt on their phone</li>
//                   <li>Customer enters their M-Pesa PIN</li>
//                   <li>Payment is confirmed automatically</li>
//                 </ol>
//               </div>
//             </mat-card-content>
//           </mat-card>
//         </div>

//       </div>
//     </div>
//   `,
//   styles: [`
//     .stk-shell { padding: 4px 0; }
//     .two-col { display: grid; grid-template-columns: 420px 1fr; gap: 24px; align-items: start; }
//     mat-card { border-radius: 16px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; }
//     mat-card-header { padding: 20px 20px 0 !important; }
//     .card-icon { border-radius: 10px !important; width: 40px !important; height: 40px !important; display: flex !important; align-items: center; justify-content: center; font-size: 22px !important; }
//     .card-icon.green { background: #dcfce7; color: #16a34a; }
//     .card-icon.red { background: #fee2e2; color: #dc2626; }
//     .mpesa-form { display: flex; flex-direction: column; gap: 4px; padding: 16px 0; }
//     .full-width { width: 100%; }
//     .submit-btn { height: 48px; font-size: 15px; font-weight: 600; border-radius: 10px !important; display: flex; align-items: center; gap: 8px; justify-content: center; margin-top: 8px; }
//     .response-col { display: flex; flex-direction: column; gap: 16px; }
//     .response-card mat-card-content { padding: 16px 20px 20px !important; }
//     .response-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
//     .resp-item { display: flex; flex-direction: column; gap: 2px; }
//     .resp-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
//     .resp-val { font-size: 14px; color: #1a1a2e; font-weight: 500; }
//     .resp-val.mono { font-family: monospace; font-size: 12px; }
//     .info-card { background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important; }
//     .info-illustration { text-align: center; padding: 20px; }
//     .info-illustration mat-icon { font-size: 48px; width: 48px; height: 48px; color: #0284c7; margin-bottom: 12px; }
//     .info-illustration h3 { font-size: 16px; font-weight: 600; margin: 0 0 16px; color: #0c4a6e; }
//     .info-illustration ol { text-align: left; color: #075985; font-size: 14px; line-height: 1.8; }
//     .mt-16 { margin-top: 16px; }
//     @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
//   `]
// })
// export class StkPushComponent implements OnInit, OnDestroy {
//   stkForm!: FormGroup;
//   stkLoading = false;
//   stkResponse: any = null;
//   private destroy$ = new Subject<void>();

//   constructor(
//     private fb: FormBuilder,
//     private mpesaService: MpesaService,
//     private authService: AuthService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void {
//     this.stkForm = this.fb.group({
//       phoneNumber: ['', [Validators.required, Validators.pattern(/^254[0-9]{9}$/)]],
//       amount: [null, [Validators.required, Validators.min(1)]],
//       accountReference: ['', Validators.required],
//       transactionDesc: ['', Validators.required],
      
      
//     });
//     const user = this.authService.currentUserValue;
//     if (user) this.stkForm.patchValue({ userId: user.id });
//   }

//   ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

//   initiateSTKPush(): void {
//     if (this.stkForm.invalid) return;
//     this.stkLoading = true;
//     this.stkResponse = null;
//     const val = this.stkForm.value;
//     const payload: STKPushRequest = {
//       phoneNumber: val.phoneNumber,
//       amount: val.amount,
//       accountReference: val.accountReference,
//       transactionDesc: val.transactionDesc,
//       callBackURL: val.callBackURL
//     };
//     this.mpesaService.initiateSTKPush(payload)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (res) => {
//           this.stkResponse = res;
//           this.stkLoading = false;
//           this.notify(res.success ? 'STK Push sent!' : 'STK Push failed', res.success ? 'success' : 'error');
//         },
//         error: (err) => {
//           this.stkLoading = false;
//           this.stkResponse = { success: false, customerMessage: err.error?.message || 'Request failed' };
//           this.notify('Failed to send STK Push', 'error');
//         }
//       });
//   }

//   goCheckStatus(checkoutId: string): void {
//     this.router.navigate(['/mpesa/status'], { queryParams: { id: checkoutId } });
//   }

//   private notify(msg: string, type: 'success' | 'error'): void {
//     this.snackBar.open(msg, 'Close', {
//       duration: 4000,
//       panelClass: type === 'success' ? ['snack-success'] : ['snack-error'],
//       horizontalPosition: 'right', verticalPosition: 'top'
//     });
//   }
// }