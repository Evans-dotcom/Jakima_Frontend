import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private publicEndpoints = [
    '/properties',
    '/properties/featured',
    '/properties/search',
    '/auth/login',
    '/auth/register',
    '/testimonials',
    '/dashboard/stats'
  ];

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isPublic = this.publicEndpoints.some(endpoint => request.url.includes(endpoint));

    if (!isPublic) {
      const token = this.authService.getToken();
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request);
  }
}