export enum PropertyType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  TOWNHOUSE = 'TOWNHOUSE',
  BUNGALOW = 'BUNGALOW',
  MAISONETTE = 'MAISONETTE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
  OFFICE = 'OFFICE',
  NEW_DEVELOPMENT = 'NEW_DEVELOPMENT'
}

export enum TransactionType {
  SALE = 'SALE',
  RENT = 'RENT',
  LEASE = 'LEASE',
  AIRBNB = 'AIRBNB'
}

export interface Property {
  id: number;
  title: string;
  description: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  price: number;
  location: string;
  estate: string;
  area: string;
  landSize: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  hasGarden: boolean;
  hasBalcony: boolean;
  hasFurnished: boolean;
  featuredImage: string;
  virtualTourUrl: string;
  propertyVideoUrl: string;
  isFeatured: boolean;
  isAvailable: boolean;
  whatsappLink: string;
  imageUrls: string[];
  viewCount: number;
  enquiryCount: number;
}