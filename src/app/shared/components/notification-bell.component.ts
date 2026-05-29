import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Imports
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

// Third party
import { ToastrService } from 'ngx-toastr';
// Note: Ensure you have installed and imported the module providing 'amTimeAgo'
// Usually: import { MomentModule } from 'ngx-moment';

import { NotificationService } from '../../core/services/notification.service';
import { MomentModule } from 'ngx-moment';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule,
    MomentModule,
    // Add MomentModule here if that's where amTimeAgo comes from
  ],
  template: `
    <button 
      mat-icon-button 
      [matMenuTriggerFor]="notificationMenu"
      [matBadge]="unreadCount" 
      matBadgeColor="warn"
      matBadgeSize="small"
    >
      <mat-icon>notifications</mat-icon>
    </button>

    <mat-menu #notificationMenu="matMenu" class="notification-menu">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button mat-button (click)="markAllAsRead()" *ngIf="unreadCount > 0">
          Mark all as read
        </button>
      </div>
      <mat-divider></mat-divider>
      
      <div class="notification-list" *ngIf="notifications.length > 0">
        <div 
          *ngFor="let notification of notifications" 
          class="notification-item"
          [class.unread]="!notification.isRead"
          (click)="onNotificationClick(notification)"
        >
          <mat-icon class="notification-icon" [color]="getNotificationColor(notification.type)">
            {{ getNotificationIcon(notification.type) }}
          </mat-icon>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">
              {{ notification.createdAt | amTimeAgo }}
            </div>
          </div>
          <button 
            mat-icon-button 
            (click)="deleteNotification(notification.id); $event.stopPropagation()"
            class="delete-btn"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      
      <div class="no-notifications" *ngIf="notifications.length === 0">
        <mat-icon>notifications_none</mat-icon>
        <p>No notifications</p>
      </div>
      
      <mat-divider></mat-divider>
      <div class="notification-footer">
        <a [routerLink]="['/notifications']">View all notifications</a>
      </div>
    </mat-menu>
  `,
  styles: [`
    .notification-menu { width: 350px; max-height: 500px; }
    .notification-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; }
    .notification-header h3 { margin: 0; font-size: 16px; font-weight: 500; }
    .notification-list { max-height: 300px; overflow-y: auto; }
    .notification-item { display: flex; align-items: flex-start; padding: 12px 16px; cursor: pointer; transition: background-color 0.2s; }
    .notification-item:hover { background-color: #f5f5f5; }
    .notification-item.unread { background-color: #e3f2fd; }
    .notification-icon { margin-right: 12px; margin-top: 4px; }
    .notification-content { flex: 1; min-width: 0; }
    .notification-title { font-weight: 500; margin-bottom: 4px; color: rgba(0, 0, 0, 0.87); }
    .notification-message { font-size: 14px; color: rgba(0, 0, 0, 0.6); margin-bottom: 4px; line-height: 1.4; }
    .notification-time { font-size: 12px; color: rgba(0, 0, 0, 0.38); }
    .delete-btn { opacity: 0; transition: opacity 0.2s; }
    .notification-item:hover .delete-btn { opacity: 1; }
    .no-notifications { text-align: center; padding: 32px 16px; color: rgba(0, 0, 0, 0.38); }
    .no-notifications mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; }
    .notification-footer { text-align: center; padding: 12px; }
    .notification-footer a { color: #2196f3; text-decoration: none; font-size: 14px; }
  `]
})
export class NotificationBellComponent implements OnInit {
  notifications: any[] = [];
  unreadCount: number = 0;

  constructor(
    private notificationService: NotificationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  loadNotifications(): void {
    this.notificationService.getUserNotifications(true).subscribe(
      notifications => {
        this.notifications = notifications.slice(0, 5);
      }
    );
  }

  getNotificationIcon(type: string): string {
    switch(type) {
      case 'Info': return 'info';
      case 'Warning': return 'warning';
      case 'Alert': return 'error';
      case 'Success': return 'check_circle';
      default: return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch(type) {
      case 'Info': return 'primary';
      case 'Warning': return 'accent';
      case 'Alert': return 'warn';
      case 'Success': return 'primary';
      default: return '';
    }
  }

  onNotificationClick(notification: any): void {
    if (!notification.isRead) {
      this.markAsRead(notification.id);
    }
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.loadNotifications();
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.loadNotifications();
      this.toastr.success('All notifications marked as read');
    });
  }

  deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotification(notificationId).subscribe(() => {
      this.loadNotifications();
      this.toastr.success('Notification deleted');
    });
  }
}