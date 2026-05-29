import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-register',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss']
})
export class RegisterComponent {
  userData = {
    fullName: '',
    email: '',
    phone: '',
    password: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.authService.register(this.userData).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Registration successful! Please login.');
          this.router.navigate(['/auth/login']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Registration failed');
        this.loading = false;
      }
    });
  }
}