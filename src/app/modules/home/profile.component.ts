import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1><i class="fas fa-user-circle"></i> My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div class="profile-content">
        <div class="profile-sidebar">
          <div class="user-card">
            <div class="avatar-container">
              <div class="avatar-large" [style.background]="getAvatarColor(currentUser?.name)">
                {{currentUser?.name?.charAt(0) || 'U'}}
              </div>
              <button class="avatar-upload" title="Change photo">
                <i class="fas fa-camera"></i>
              </button>
            </div>
            <h3>{{currentUser?.name || 'User'}}</h3>
            <p class="user-role">{{currentUser?.roles?.[0] || 'Employee'}}</p>
            <p class="user-email">{{currentUser?.email || 'user@example.com'}}</p>
            <div class="user-stats">
              <div class="stat">
                <strong>24</strong>
                <span>KPIs</span>
              </div>
              <div class="stat">
                <strong>85%</strong>
                <span>Progress</span>
              </div>
              <div class="stat">
                <strong>12</strong>
                <span>Teams</span>
              </div>
            </div>
          </div>

          <nav class="profile-nav">
            <button class="nav-item" [class.active]="activeTab === 'personal'" (click)="activeTab = 'personal'">
              <i class="fas fa-user"></i> Personal Info
            </button>
            <button class="nav-item" [class.active]="activeTab === 'security'" (click)="activeTab = 'security'">
              <i class="fas fa-shield-alt"></i> Security
            </button>
            <button class="nav-item" [class.active]="activeTab === 'preferences'" (click)="activeTab = 'preferences'">
              <i class="fas fa-cog"></i> Preferences
            </button>
            <button class="nav-item" [class.active]="activeTab === 'notifications'" (click)="activeTab = 'notifications'">
              <i class="fas fa-bell"></i> Notifications
            </button>
            <button class="nav-item" [class.active]="activeTab === 'documents'" (click)="activeTab = 'documents'">
              <i class="fas fa-file-alt"></i> Documents
            </button>
          </nav>
        </div>

        <div class="profile-main">
          <div *ngIf="activeTab === 'personal'" class="tab-content">
            <div class="tab-header">
              <h2><i class="fas fa-user-edit"></i> Personal Information</h2>
              <button class="btn btn-primary" (click)="saveProfile()" [disabled]="!profileForm.dirty || isLoading">
                {{isLoading ? 'Saving...' : 'Save Changes'}}
              </button>
            </div>

            <form [formGroup]="profileForm" class="profile-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="fullName">Full Name *</label>
                  <input type="text" id="fullName" formControlName="fullName" placeholder="Enter your full name">
                </div>
                <div class="form-group">
                  <label for="email">Email Address *</label>
                  <input type="email" id="email" formControlName="email" placeholder="Enter your email">
                </div>
                <div class="form-group">
                  <label for="phone">Phone Number</label>
                  <input type="tel" id="phone" formControlName="phone" placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                  <label for="department">Department</label>
                  <select id="department" formControlName="department">
                    <option value="">Select Department</option>
                    <option value="IT">Information Technology</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="jobTitle">Job Title</label>
                  <input type="text" id="jobTitle" formControlName="jobTitle" placeholder="Enter your job title">
                </div>
                <div class="form-group">
                  <label for="employeeId">Employee ID</label>
                  <input type="text" id="employeeId" formControlName="employeeId" placeholder="Enter employee ID">
                </div>
              </div>
              <div class="form-group">
                <label for="bio">Bio / About Me</label>
                <textarea id="bio" formControlName="bio" rows="4" placeholder="Tell us about yourself..."></textarea>
              </div>
              <div class="form-group">
                <label for="skills">Skills & Expertise</label>
                <div class="skills-container">
                  <div *ngFor="let skill of skills" class="skill-tag">
                    {{skill}}
                    <button type="button" (click)="removeSkill(skill)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <input type="text" placeholder="Add a skill and press Enter" (keyup.enter)="addSkill($event)">
                </div>
              </div>
            </form>

            <div class="card">
              <h3><i class="fas fa-calendar-alt"></i> Recent Activity</h3>
              <div class="activity-list">
                <div *ngFor="let activity of recentActivities" class="activity-item">
                  <i [class]="activity.icon"></i>
                  <div class="activity-details">
                    <p>{{activity.description}}</p>
                    <span class="time">{{activity.time}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="activeTab === 'security'" class="tab-content">
            <div class="tab-header">
              <h2><i class="fas fa-shield-alt"></i> Security Settings</h2>
            </div>
            <div class="security-grid">
              <div class="security-card">
                <h3><i class="fas fa-key"></i> Change Password</h3>
                <form [formGroup]="passwordForm" class="security-form">
                  <div class="form-group">
                    <label for="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" formControlName="currentPassword" placeholder="Enter current password">
                  </div>
                  <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" formControlName="newPassword" placeholder="Enter new password">
                  </div>
                  <div class="form-group">
                    <label for="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" formControlName="confirmPassword" placeholder="Confirm new password">
                  </div>
                  <button type="submit" class="btn btn-primary" (click)="changePassword()" [disabled]="passwordForm.invalid">
                    Update Password
                  </button>
                </form>
              </div>
              <div class="security-card">
                <h3><i class="fas fa-lock"></i> Two-Factor Authentication</h3>
                <div class="security-status">
                  <span class="status-badge" [ngClass]="twoFactorEnabled ? 'enabled' : 'disabled'">
                    {{twoFactorEnabled ? 'Enabled' : 'Disabled'}}
                  </span>
                </div>
                <p>Add an extra layer of security to your account.</p>
                <button class="btn btn-secondary" (click)="toggleTwoFactor()">
                  {{twoFactorEnabled ? 'Disable' : 'Enable'}} 2FA
                </button>
              </div>
              <div class="security-card">
                <h3><i class="fas fa-desktop"></i> Active Sessions</h3>
                <div class="sessions-list">
                  <div *ngFor="let session of activeSessions" class="session-item">
                    <i [class]="session.device === 'Mobile' ? 'fas fa-mobile-alt' : 'fas fa-desktop'"></i>
                    <div class="session-details">
                      <strong>{{session.browser}} on {{session.device}}</strong>
                      <span>{{session.location}} • {{session.lastActive}}</span>
                    </div>
                    <button class="btn-icon" *ngIf="!session.current" (click)="logoutSession(session.id)">
                      <i class="fas fa-sign-out-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            <i class="fas fa-check-circle"></i> {{successMessage}}
          </div>
          <div *ngIf="errorMessage" class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i> {{errorMessage}}
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  activeTab = 'personal';
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any = null;
  isLoading = false;
  skills: string[] = ['JavaScript', 'Angular', 'TypeScript', 'UI/UX Design'];
  recentActivities: any[] = [];
  activeSessions: any[] = [];
  twoFactorEnabled = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: [''],
      jobTitle: [''],
      employeeId: [''],
      bio: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadSampleData();
  }

  loadUserData() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          fullName: (user.firstName || '') + ' ' + (user.lastName || ''),
          email: user.email
        });
      }
    });
  }

  loadSampleData() {
    this.recentActivities = [
      { icon: 'fas fa-chart-line', description: 'Updated Q3 KPI progress', time: '2 hours ago' },
      { icon: 'fas fa-file-upload', description: 'Submitted monthly report', time: '1 day ago' },
      { icon: 'fas fa-comments', description: 'Commented on team project', time: '2 days ago' },
      { icon: 'fas fa-trophy', description: 'Achieved monthly target', time: '1 week ago' }
    ];

    this.activeSessions = [
      { id: 1, browser: 'Chrome', device: 'Desktop', location: 'Nairobi, Kenya', lastActive: 'Now', current: true },
      { id: 2, browser: 'Firefox', device: 'Mobile', location: 'Mombasa, Kenya', lastActive: '2 hours ago', current: false },
      { id: 3, browser: 'Safari', device: 'Tablet', location: 'Kisumu, Kenya', lastActive: '1 day ago', current: false }
    ];
  }

  getAvatarColor(name: string): string {
    const colors = ['#667eea', '#764ba2', '#f56565', '#ed8936', '#48bb78'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.apiService['updateProfile'](this.profileForm.value).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.isLoading = false;
        this.profileForm.markAsPristine();
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Failed to update profile';
        this.isLoading = false;
      }
    });
  }

  addSkill(event: any) {
    const skill = event.target.value.trim();
    if (skill && !this.skills.includes(skill)) {
      this.skills.push(skill);
      event.target.value = '';
    }
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter(s => s !== skill);
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.passwordForm.reset();
    this.successMessage = 'Password updated successfully!';
  }

  toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    this.successMessage = `Two-factor authentication ${this.twoFactorEnabled ? 'enabled' : 'disabled'}`;
  }

  logoutSession(sessionId: number) {
    this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
    this.successMessage = 'Session logged out successfully';
  }
}