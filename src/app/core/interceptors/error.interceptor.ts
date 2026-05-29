import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private publicEndpoints = [
    '/properties',
    '/properties/featured',
    '/properties/search',
    '/auth/login',
    '/auth/register',
    '/testimonials',
    '/dashboard/stats'
  ];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isPublic = this.publicEndpoints.some(endpoint => request.url.includes(endpoint));

        if (error.status === 401) {
          if (!isPublic && this.authService.isLoggedIn()) {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            this.toastr.error('Session expired. Please login again.');
          }
        } else if (error.status === 403) {
          this.toastr.error('You do not have permission to perform this action.');
        } else if (error.status === 500) {
          this.toastr.error('Server error. Please try again later.');
        }

        return throwError(() => error);
      })
    );
  }
}