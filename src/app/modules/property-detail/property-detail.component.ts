import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../core/services/property.service';
import { EnquiryService } from '../../core/services/enquiry.service';
import { Property, TransactionType, PropertyType } from '../../core/models/property.model';
import { Enquiry } from '../../core/models/enquiry.model';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  relatedProperties: Property[] = [];
  selectedImage = '';
  showEnquiryForm = false;
  currentImageIndex = 0;
  isLoading = true;
  error = '';
  
  enquiry: Enquiry = {
    id: 0,
    fullName: '',
    email: '',
    phone: '',
    message: '',
    enquiryType: 'PROPERTY_VIEWING',
    status: 'PENDING',
    enquiryDate: '',
    isWhatsappEnabled: true,
    propertyId: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private enquiryService: EnquiryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadProperty(id);
    }
  }

  loadProperty(id: number): void {
    this.isLoading = true;
    this.propertyService.getProperty(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.property = res.data;
          this.selectedImage = this.property?.featuredImage || '';
          this.enquiry.propertyId = this.property?.id;
          this.loadRelatedProperties();
        } else {
          this.error = 'Property not found';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error loading property';
        this.isLoading = false;
      }
    });
  }

  loadRelatedProperties(): void {
    if (!this.property) return;
    
    this.propertyService.getProperties().subscribe({
      next: (res) => {
        if (res.success) {
          this.relatedProperties = res.data
            .filter((p: Property) => 
              p.id !== this.property?.id && 
              (p.location === this.property?.location || 
               p.propertyType === this.property?.propertyType)
            )
            .slice(0, 4);
        }
      }
    });
  }

  selectImage(url: string, index: number): void {
    this.selectedImage = url;
    this.currentImageIndex = index;
  }

  nextImage(): void {
    if (this.property?.imageUrls && this.currentImageIndex < this.property.imageUrls.length - 1) {
      this.currentImageIndex++;
      this.selectedImage = this.property.imageUrls[this.currentImageIndex];
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.selectedImage = this.property!.imageUrls[this.currentImageIndex];
    }
  }

  openWhatsApp(): void {
    if (this.property) {
      const message = `Hello, I'm interested in ${this.property.title} located in ${this.property.location} priced at KES ${this.property.price}. Please share more details.`;
      window.open(`https://wa.me/254719127100?text=${encodeURIComponent(message)}`, '_blank');
    }
  }

  submitEnquiry(): void {
    this.enquiryService.submitEnquiry(this.enquiry).subscribe({
      next: (res) => {
        if (res.success) {
          this.showEnquiryForm = false;
          alert('Enquiry submitted successfully! We will contact you soon.');
          this.resetEnquiry();
        }
      },
      error: (err) => {
        alert('Error submitting enquiry. Please try again.');
      }
    });
  }

  resetEnquiry(): void {
    this.enquiry = {
      id: 0,
      fullName: '',
      email: '',
      phone: '',
      message: '',
      enquiryType: 'PROPERTY_VIEWING',
      status: 'PENDING',
      enquiryDate: '',
      isWhatsappEnabled: true,
      propertyId: this.property?.id || 0
    };
  }

  goBack(): void {
    this.router.navigate(['/listings']);
  }

  goToProperty(propertyId: number): void {
    this.router.navigate(['/property', propertyId]);
    window.scrollTo(0, 0);
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
}