import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Testimonial } from '../models/enquiry.model';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  constructor(private api: ApiService) {}

  submitTestimonial(testimonial: Testimonial): Observable<any> {
    return this.api.post('/testimonials', testimonial);
  }

  getApprovedTestimonials(): Observable<any> {
    return this.api.get('/testimonials/approved');
  }

  getAllTestimonials(): Observable<any> {
    return this.api.get('/testimonials');
  }

  approveTestimonial(id: number): Observable<any> {
    return this.api.patch(`/testimonials/${id}/approve`, {});
  }

  deleteTestimonial(id: number): Observable<any> {
    return this.api.delete(`/testimonials/${id}`);
  }
}