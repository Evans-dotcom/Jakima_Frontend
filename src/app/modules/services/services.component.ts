import { Component } from '@angular/core';
import { EnquiryService } from '../../core/services/enquiry.service';
import { ServiceRequest } from '../../core/models/enquiry.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
   standalone: true,
  imports:[CommonModule,FormsModule,RouterModule],
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  showRequestForm = false;
  selectedService = '';
  request: ServiceRequest = {
    id: 0,
    fullName: '',
    email: '',
    phone: '',
    serviceType: '',
    propertyAddress: '',
    estimatedValue: 0,
    message: '',
    status: 'PENDING',
    requestDate: ''
  };

  services = [
    {
      name: 'Buy a Property',
      icon: 'fa-home',
      description: 'We guide you through every step of purchasing your ideal home or investment property in Kenya - from first viewing to title transfer.',
      button: 'Browse Listings',
      link: '/listings',
      type: 'BUY_PROPERTY'
    },
    {
      name: 'Sell Your Property',
      icon: 'fa-chart-line',
      description: 'Get the best market value for your property. We handle professional photography, listings, viewings, and negotiations on your behalf.',
      button: 'Start Selling',
      link: '#',
      type: 'SELL_PROPERTY'
    },
    {
      name: 'Rent / Lettings',
      icon: 'fa-key',
      description: 'Find your perfect rental in Nairobi or let your property with confidence. We manage tenant screening, leases, and deposits.',
      button: 'View Rentals',
      link: '/listings',
      type: 'RENT_PROPERTY'
    },
    {
      name: 'Property Valuations',
      icon: 'fa-chart-simple',
      description: 'Get an accurate, data-driven market valuation for your property. Our reports are accepted by major Kenyan banks.',
      button: 'Request Valuation',
      link: '#',
      type: 'PROPERTY_VALUATION'
    },
    {
      name: 'Property Management',
      icon: 'fa-building',
      description: 'Sit back and earn. We handle rent collection, maintenance, tenant relations, and monthly reporting for your portfolio.',
      button: 'Learn More',
      link: '#',
      type: 'PROPERTY_MANAGEMENT'
    },
    {
      name: 'Investment Advisory',
      icon: 'fa-chart-pie',
      description: 'Maximise your real estate ROI in Kenya. We identify high-growth areas and emerging opportunities before the market catches on.',
      button: 'Talk to an Advisor',
      link: '#',
      type: 'INVESTMENT_ADVISORY'
    }
  ];

  constructor(private enquiryService: EnquiryService) {}

  openRequestForm(serviceType: string, serviceName: string): void {
    this.selectedService = serviceName;
    this.request.serviceType = serviceType;
    this.showRequestForm = true;
  }

  closeRequestForm(): void {
    this.showRequestForm = false;
    this.resetForm();
  }

  submitRequest(): void {
    this.enquiryService.submitServiceRequest(this.request).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Service request submitted successfully! We will contact you within 24 hours.');
          this.closeRequestForm();
        }
      },
      error: (err) => {
        alert('Error submitting request. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.request = {
      id: 0,
      fullName: '',
      email: '',
      phone: '',
      serviceType: '',
      propertyAddress: '',
      estimatedValue: 0,
      message: '',
      status: 'PENDING',
      requestDate: ''
    };
  }
}