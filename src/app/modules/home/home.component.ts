import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../core/services/property.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { TestimonialService } from '../../core/services/testimonial.service';
import { Property, TransactionType, PropertyType } from '../../core/models/property.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProperties: Property[] = [];
  testimonials: any[] = [];
  stats: any = {};
  searchParams = {
    location: '',
    propertyType: '',
    transactionType: ''
  };

  propertyTypes = Object.values(PropertyType);
  transactionTypes = Object.values(TransactionType);

  constructor(
    private propertyService: PropertyService,
    private dashboardService: DashboardService,
    private testimonialService: TestimonialService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFeaturedProperties();
    this.loadTestimonials();
    this.loadStats();
  }

  loadFeaturedProperties(): void {
    this.propertyService.getFeaturedProperties().subscribe({
      next: (res) => {
        if (res.success) this.featuredProperties = res.data;
      },
      error: (err) => console.error('Error loading featured properties:', err)
    });
  }

  loadTestimonials(): void {
    this.testimonialService.getApprovedTestimonials().subscribe({
      next: (res) => {
        if (res.success) this.testimonials = res.data.slice(0, 5);
      },
      error: (err) => console.error('Error loading testimonials:', err)
    });
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        if (res.success) this.stats = res.data;
      },
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  search(): void {
    const queryParams: any = {};
    if (this.searchParams.location) queryParams['location'] = this.searchParams.location;
    if (this.searchParams.propertyType) queryParams['propertyType'] = this.searchParams.propertyType;
    if (this.searchParams.transactionType) queryParams['transactionType'] = this.searchParams.transactionType;
    this.router.navigate(['/listings'], { queryParams });
  }

  setTransactionType(type: string): void {
    this.searchParams.transactionType = type;
    this.router.navigate(['/listings'], { queryParams: { transactionType: type } });
  }

  filterByCategory(category: string): void {
    let propertyType = '';
    switch (category) {
      case 'apartments':
        propertyType = 'APARTMENT';
        break;
      case 'houses':
        propertyType = 'VILLA';
        break;
      case 'land':
        propertyType = 'LAND';
        break;
      case 'commercial':
        propertyType = 'COMMERCIAL';
        break;
      case 'new-developments':
        propertyType = 'NEW_DEVELOPMENT';
        break;
    }
    this.router.navigate(['/listings'], { queryParams: { propertyType: propertyType } });
  }

  openWhatsApp(event: Event, property: Property): void {
    event.stopPropagation();
    const message = `Hello, I'm interested in ${property.title} located in ${property.location} priced at KES ${property.price}. Please share more details.`;
    window.open(`https://wa.me/254719127100?text=${encodeURIComponent(message)}`, '_blank');
  }

  goToProperty(propertyId: number): void {
    this.router.navigate(['/property', propertyId]);
  }
}