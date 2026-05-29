import { Component } from '@angular/core';
import { EnquiryService } from '../../core/services/enquiry.service';
import { Enquiry } from '../../core/models/enquiry.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports:[CommonModule,FormsModule,RouterModule],
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  enquiry: Enquiry = {
    id: 0,
    fullName: '',
    email: '',
    phone: '',
    message: '',
    enquiryType: 'CONTACT_US',
    status: 'PENDING',
    enquiryDate: '',
    isWhatsappEnabled: false
  };

  submitted = false;

  constructor(private enquiryService: EnquiryService) {}

  submitContact(): void {
    this.enquiryService.submitEnquiry(this.enquiry).subscribe({
      next: (res) => {
        if (res.success) {
          this.submitted = true;
          setTimeout(() => {
            this.submitted = false;
            this.resetForm();
          }, 3000);
        }
      }
    });
  }

  resetForm(): void {
    this.enquiry = {
      id: 0,
      fullName: '',
      email: '',
      phone: '',
      message: '',
      enquiryType: 'CONTACT_US',
      status: 'PENDING',
      enquiryDate: '',
      isWhatsappEnabled: false
    };
  }

  openWhatsApp(): void {
    window.open('https://wa.me/254719127100', '_blank');
  }
}