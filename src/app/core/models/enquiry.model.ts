export interface Enquiry {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  enquiryType: string;
  status: string;
  enquiryDate: string;
  isWhatsappEnabled: boolean;
  propertyId?: number;
}

export interface ServiceRequest {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  propertyAddress: string;
  estimatedValue: number;
  message: string;
  status: string;
  requestDate: string;
}

export interface Testimonial {
  id: number;
  clientName: string;
  content: string;
  rating: number;
  clientType: string;
  isApproved: boolean;
  createdAt: string;
}