import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    if (this.authService.isAuthenticated) {
      this.loadUnreadCount();
    }
  }

  getUserNotifications(unreadOnly: boolean = false): Observable<any[]> {
    if (!this.authService.isAuthenticated) {
      return of([]);
    }
    return this.apiService.get<any[]>('notifications', { unreadOnly });
  }

  getUnreadCount(): Observable<number> {
    if (!this.authService.isAuthenticated) {
      return of(0);
    }
    return this.apiService.get<any>('notifications/count')
      .pipe(
        map(response => response.count || 0),
        catchError(() => of(0))
      );
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.apiService.put(`notifications/${notificationId}/read`, {})
      .pipe(
        tap(() => this.loadUnreadCount())
      );
  }

  markAllAsRead(): Observable<any> {
    return this.apiService.put('notifications/read-all', {})
      .pipe(
        tap(() => this.loadUnreadCount())
      );
  }

  deleteNotification(notificationId: number): Observable<any> {
    return this.apiService.delete(`notifications/${notificationId}`);
  }

  sendTestNotification(): Observable<any> {
    return this.apiService.post('notifications/test', {});
  }

  loadUnreadCount(): void {
    if (this.authService.isAuthenticated) {
      this.getUnreadCount().subscribe(count => {
        this.unreadCountSubject.next(count);
      });
    }
  }

  updateUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }
}