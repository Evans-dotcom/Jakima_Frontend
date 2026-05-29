import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private api: ApiService) {}

  login(credentials: LoginRequest): Observable<any> {
    return this.api.post('/auth/login', credentials).pipe(
      tap((response: any) => {
        if (response.success && response.data?.token) {
          localStorage.setItem(this.tokenKey, response.data.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.data));
          this.isLoggedInSubject.next(true);
          console.log('Login successful, token saved:', response.data.token);
          console.log('User saved:', response.data);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.api.post('/auth/register', userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedInSubject.next(false);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Getting token:', token ? 'Token exists' : 'No token');
    return token;
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('User retrieved:', parsedUser);
        return parsedUser;
      } catch (e) {
        console.error('Error parsing user:', e);
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    const loggedIn = this.hasToken();
    console.log('isLoggedIn check:', loggedIn);
    return loggedIn;
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    if (user && user.role) {
      const userRole = user.role.toUpperCase();
      const requiredRole = role.toUpperCase();
      const hasRole = userRole === `ROLE_${requiredRole}` || userRole === requiredRole;
      console.log(`Checking role ${role}:`, hasRole, 'User role:', userRole);
      return hasRole;
    }
    return false;
  }

  private hasToken(): boolean {
    const token = this.getToken();
    return !!token;
  }
}