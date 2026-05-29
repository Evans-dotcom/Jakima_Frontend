import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Enquiry, ServiceRequest } from '../models/enquiry.model';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  constructor(private api: ApiService) {}

  submitEnquiry(enquiry: Enquiry): Observable<any> {
    return this.api.post('/enquiries', enquiry);
  }

  getEnquiries(): Observable<any> {
    return this.api.get('/enquiries');
  }

  getEnquiriesByProperty(propertyId: number): Observable<any> {
    return this.api.get(`/enquiries/property/${propertyId}`);
  }

  updateEnquiryStatus(id: number, status: string): Observable<any> {
    return this.api.patch(`/enquiries/${id}/status?status=${status}`, {});
  }

  submitServiceRequest(request: ServiceRequest): Observable<any> {
    return this.api.post('/services', request);
  }

  getServiceRequests(): Observable<any> {
    return this.api.get('/services');
  }

  updateServiceRequestStatus(id: number, status: string): Observable<any> {
    return this.api.patch(`/services/${id}/status?status=${status}`, {});
  }
}