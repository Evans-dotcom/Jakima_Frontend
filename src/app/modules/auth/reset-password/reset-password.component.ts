import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true, // Added standalone
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Added imports
  template: `
    <div class="auth-container">
      <div class="card">
        <h2>Reset Password</h2>
        <p class="subtitle">Enter your new password below.</p>
        
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
          <input type="hidden" formControlName="token">
          
          <div class="form-group">
            <label for="password">New Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              placeholder="Enter new password"
              [class.is-invalid]="resetForm.get('password')?.invalid && resetForm.get('password')?.touched">
            <div *ngIf="resetForm.get('password')?.invalid && resetForm.get('password')?.touched" class="error-message">
              Password must be at least 6 characters
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword"
              placeholder="Confirm new password"
              [class.is-invalid]="resetForm.get('confirmPassword')?.invalid && resetForm.get('confirmPassword')?.touched">
            <div *ngIf="resetForm.get('confirmPassword')?.invalid && resetForm.get('confirmPassword')?.touched" class="error-message">
              Passwords must match
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="resetForm.invalid || isLoading">
            {{ isLoading ? 'Resetting...' : 'Reset Password' }}
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
      </div>
    </div>
  `,
  styleUrls: ['./reset-password.component.css'] // This is correct if file exists
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      token: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    this.resetForm.patchValue({ token: this.token });
    
    // Validate token on component load
    if (!this.token) {
      this.errorMessage = 'Invalid or expired reset link';
    }
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { password, token } = this.resetForm.value;
    
    // Simulating API call
    setTimeout(() => {
      console.log('Resetting password with token:', token);
      this.successMessage = 'Password reset successfully! Redirecting to login...';
      this.isLoading = false;
      
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
    }, 1500);
  }
}