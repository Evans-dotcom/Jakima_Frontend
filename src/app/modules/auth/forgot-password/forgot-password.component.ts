// modules/auth/forgot-password/forgot-password.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Forgot Password</mat-card-title>
          <mat-card-subtitle>Enter your email address and we'll send you a link to reset your password.</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input 
                matInput
                type="email" 
                formControlName="email"
                placeholder="Enter your registered email">
              <mat-error *ngIf="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched">
                Valid email is required
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button
              color="primary"
              type="submit" 
              class="full-width"
              [disabled]="forgotForm.invalid || isLoading">
              {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>

            <div *ngIf="errorMessage" class="alert alert-error">
              {{ errorMessage }}
            </div>

            <div *ngIf="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>

            <div class="text-center mt-3">
              <a routerLink="/auth/login" class="link">Back to Login</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 400px;
      width: 100%;
    }
    .card {
      padding: 32px;
    }
    mat-card-header {
      text-align: center;
      margin-bottom: 32px;
    }
    mat-card-title {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    mat-card-subtitle {
      font-size: 14px;
      line-height: 1.5;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .alert {
      padding: 12px;
      border-radius: 4px;
      margin-top: 16px;
      font-size: 14px;
    }
    .alert-error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ef5350;
    }
    .alert-success {
      background-color: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #66bb6a;
    }
    .text-center {
      text-align: center;
    }
    .mt-3 {
      margin-top: 24px;
    }
    .link {
      color: #1976d2;
      text-decoration: none;
      font-size: 14px;
    }
    .link:hover {
      text-decoration: underline;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.forgotForm.value.email;
    
    // Simulating API call
    setTimeout(() => {
      console.log('Sending reset link to:', email);
      this.successMessage = 'If an account exists with this email, you will receive a password reset link shortly.';
      this.isLoading = false;
      this.forgotForm.reset();
    }, 1500);
    
    // Actual implementation would be:
    // this.authService.forgotPassword(email).subscribe({
    //   next: () => {
    //     this.successMessage = 'If an account exists with this email, you will receive a password reset link shortly.';
    //     this.isLoading = false;
    //     this.forgotForm.reset();
    //   },
    //   error: (error) => {
    //     this.errorMessage = error.error?.message || 'Failed to send reset link. Please try again.';
    //     this.isLoading = false;
    //   }
    // });
  }
}