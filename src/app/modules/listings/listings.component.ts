import { Component, OnInit, OnDestroy } from '@angular/core';
import { PropertyService } from '../../core/services/property.service';
import { Property, TransactionType, PropertyType } from '../../core/models/property.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit, OnDestroy {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  searchTerm = '';
  selectedTransactionType = '';
  selectedPropertyType = '';
  sortBy = 'newest';
  showFilters = false;
  isLoading = true;
  private querySubscription!: Subscription;

  transactionTypes = Object.values(TransactionType);
  propertyTypes = Object.values(PropertyType);

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.querySubscription = this.route.queryParams.subscribe(params => {
      if (params['location']) this.searchTerm = params['location'];
      if (params['propertyType']) this.selectedPropertyType = params['propertyType'];
      if (params['transactionType']) this.selectedTransactionType = params['transactionType'];
      this.loadProperties();
    });
  }

  ngOnDestroy(): void {
    if (this.querySubscription) this.querySubscription.unsubscribe();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.propertyService.getProperties().subscribe({
      next: (res) => {
        if (res.success) {
          this.properties = res.data;
          this.search();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading properties:', err);
        this.isLoading = false;
      }
    });
  }

  search(): void {
    this.filteredProperties = this.properties.filter(property => {
      const matchesSearch = this.searchTerm === '' || 
        property.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        property.location?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        property.estate?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesTransactionType = !this.selectedTransactionType || 
        property.transactionType === this.selectedTransactionType;
      
      const matchesPropertyType = !this.selectedPropertyType || 
        property.propertyType === this.selectedPropertyType;
      
      return matchesSearch && matchesTransactionType && matchesPropertyType;
    });

    this.sortProperties();
  }

  sortProperties(): void {
    switch(this.sortBy) {
      case 'newest':
        this.filteredProperties.sort((a, b) => b.id - a.id);
        break;
      case 'price-low':
        this.filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProperties.sort((a, b) => b.price - a.price);
        break;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedTransactionType = '';
    this.selectedPropertyType = '';
    this.sortBy = 'newest';
    this.router.navigate(['/listings']);
  }

  openWhatsApp(event: Event, property: Property): void {
    event.stopPropagation();
    const message = `Hello, I'm interested in ${property.title} located in ${property.location} priced at KES ${property.price}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/254719127100?text=${encodedMessage}`, '_blank');
  }

  goToPropertyDetail(propertyId: number): void {
    this.router.navigate(['/property', propertyId]);
  }

  getImageUrl(property: Property): string {
    if (property.imageUrls && property.imageUrls.length > 0) {
      return property.imageUrls[0];
    }
    if (property.featuredImage) {
      return property.featuredImage;
    }
    return 'assets/images/Dream House.jpg';
  }

  hasVideo(property: Property): boolean {
    return !!(property.propertyVideoUrl);
  }
}