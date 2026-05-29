import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(private api: ApiService) {}

  getProperties(): Observable<any> {
    return this.api.get('/properties', false);
  }

  getProperty(id: number): Observable<any> {
    return this.api.get(`/properties/${id}`, false);
  }

  getFeaturedProperties(): Observable<any> {
    return this.api.get('/properties/featured', false);
  }

  searchProperties(params: any): Observable<any> {
    let query = '/properties/search?';
    if (params.location) query += `location=${params.location}&`;
    if (params.propertyType) query += `propertyType=${params.propertyType}&`;
    if (params.transactionType) query += `transactionType=${params.transactionType}&`;
    if (params.minPrice) query += `minPrice=${params.minPrice}&`;
    if (params.maxPrice) query += `maxPrice=${params.maxPrice}&`;
    return this.api.get(query, false);
  }

  getPropertiesByType(transactionType: string): Observable<any> {
    return this.api.get(`/properties/type/${transactionType}`, false);
  }

  createProperty(property: any): Observable<any> {
    return this.api.post('/properties', property, true);
  }

  createPropertyWithImages(
    propertyData: any,
    featuredImage: File | null,
    additionalImages: File[],
    propertyVideo: File | null
  ): Observable<any> {
    const formData = new FormData();
    
    // Convert property data to JSON string as backend expects
    const propertyJson = JSON.stringify(propertyData);
    formData.append('property', propertyJson);
    
    // Add featured image
    if (featuredImage) {
      formData.append('featuredImage', featuredImage);
    }
    
    // Add additional images (multiple)
    if (additionalImages && additionalImages.length > 0) {
      additionalImages.forEach(image => {
        formData.append('additionalImages', image);
      });
    }
    
    // Add property video
    if (propertyVideo) {
      formData.append('propertyVideo', propertyVideo);
    }
    
    return this.api.postFormData('/properties/with-images', formData, true);
  }

  updateProperty(id: number, property: any): Observable<any> {
    return this.api.put(`/properties/${id}`, property, true);
  }

  deleteProperty(id: number): Observable<any> {
    return this.api.delete(`/properties/${id}`, true);
  }

  getWhatsAppLink(id: number, customerName: string, customerPhone: string): Observable<any> {
    return this.api.get(`/whatsapp/property/${id}?customerName=${customerName}&customerPhone=${customerPhone}`, false);
  }
}