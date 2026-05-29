import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-login',
  templateUrl: './logins.component.html',
  styleUrls: ['./logins.component.scss']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastr.success('Login successful!');
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.toastr.error('Invalid email or password');
        this.loading = false;
      }
    });
  }
}