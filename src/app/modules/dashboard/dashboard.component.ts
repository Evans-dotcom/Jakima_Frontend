import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { PropertyService } from '../../core/services/property.service';
import { EnquiryService } from '../../core/services/enquiry.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  user: any;
  featuredProperties: any[] = [];
  enquiries: any[] = [];
  greeting = '';
  currentTime = new Date();
  isAdmin = false;
  loading = true;

  quickActions = [
    { icon: 'fas fa-search', label: 'Browse Properties', route: '/listings', color: 'teal' },
    { icon: 'fas fa-envelope', label: 'My Enquiries', action: 'enquiries', color: 'blue' },
    { icon: 'fas fa-star', label: 'Leave Review', action: 'review', color: 'amber' },
    { icon: 'fas fa-phone', label: 'Contact Agent', route: '/contact', color: 'coral' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private propertyService: PropertyService,
    private enquiryService: EnquiryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.setGreeting();
    this.loadAll();
  }

  setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 17) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  loadAll(): void {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (res) => { if (res.success) this.stats = res.data; },
      error: () => {}
    });

    this.propertyService.getFeaturedProperties().subscribe({
      next: (res) => { if (res.success) this.featuredProperties = res.data.slice(0, 3); },
      error: () => {}
    });

    this.enquiryService.getEnquiries().subscribe({
      next: (res) => {
        if (res.success) this.enquiries = res.data.slice(0, 4);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  handleQuickAction(action: any): void {
    if (action.route) {
      this.router.navigateByUrl(action.route);
    }
  }

  openWhatsApp(): void {
    window.open('https://wa.me/254719127100', '_blank');
  }

  getInitials(): string {
    if (!this.user?.fullName) return 'U';
    return this.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatPrice(price: number): string {
    if (price >= 1000000) return `KES ${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `KES ${(price / 1000).toFixed(0)}K`;
    return `KES ${price}`;
  }
}