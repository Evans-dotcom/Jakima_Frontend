import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Chart from 'chart.js/auto';

import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { PropertyService } from '../../../core/services/property.service';
import { EnquiryService } from '../../../core/services/enquiry.service';
import { PropertyType, TransactionType } from '../../../core/models/property.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  user: any;
  stats: any = {};
  activeSection = 'dashboard';
  leadChart: any;
  enquiryChart: any;
  sourceChart: any;

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { id: 'leads', label: 'Leads', icon: 'fas fa-users' },
    { id: 'listings', label: 'Listings', icon: 'fas fa-building' },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' }
  ];

  properties: any[] = [];
  filteredProperties: any[] = [];
  propertySearchTerm = '';
  propertyTypes = Object.values(PropertyType);
  transactionTypes = Object.values(TransactionType);

  showPropertyForm = false;
  editingProperty: any = null;
  propertyForm: any = {
    title: '', description: '', location: '', estate: '',
    price: null, propertyType: '', transactionType: '',
    bedrooms: null, bathrooms: null, landSize: null,
    featured: false, images: [], videos: []
  };
  selectedImageFiles: File[] = [];
  selectedVideoFiles: File[] = [];
  imagePreviewUrls: string[] = [];
  videoPreviewUrls: string[] = [];
  propertyLoading = false;
  propertySaving = false;

  leads: any[] = [];
  filteredLeads: any[] = [];
  leadSearch = '';
  leadStatusFilter = '';
  leadTypeFilter = '';
  leadsLoading = false;
  leadStatuses = ['NEW', 'CONTACTED', 'VIEWING', 'NEGOTIATING', 'CLOSED', 'LOST'];

  settings: any = {
    companyName: 'Jakima Properties',
    physicalAddress: 'Westlands Business Park, Westlands, Nairobi',
    whatsappNumber: '+254719127100',
    businessPhone: '+254719127100',
    businessEmail: 'info@jakimaestate.com',
    emailAlerts: true,
    whatsappAlerts: false
  };
  settingsSaved = false;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private propertyService: PropertyService,
    private enquiryService: EnquiryService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadStats();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (res) => { if (res.success) this.stats = res.data; },
      error: () => { }
    });
  }

  setSection(section: string): void {
    this.activeSection = section;

    if (section === 'analytics') {
      setTimeout(() => this.loadAnalyticsCharts(), 100); // wait for DOM
    }

    if (section === 'listings' && this.properties.length === 0) this.loadProperties();
    if (section === 'leads' && this.leads.length === 0) this.loadLeads();
  }

  loadAnalyticsCharts(): void {

    if (this.leadChart) this.leadChart.destroy();
    if (this.enquiryChart) this.enquiryChart.destroy();
    if (this.sourceChart) this.sourceChart.destroy();

    // 👉 Replace static data below with backend analytics response in future

    this.leadChart = new Chart('leadChart', {
      type: 'bar',
      data: {
        labels: ['12 Mar', '13 Mar', '14 Mar', '15 Mar', '16 Mar', '17 Mar', '18 Mar', '19 Mar', '20 Mar'],
        datasets: [{
          label: 'Leads',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 10],
          backgroundColor: '#c9a84c',
          borderRadius: 6,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    this.enquiryChart = new Chart('enquiryChart', {
      type: 'pie',
      data: {
        labels: ['Buy', 'Rent', 'Sell', 'Valuation'],
        datasets: [{
          data: [50, 30, 10, 10],
          backgroundColor: ['#c9a84c', '#22c55e', '#1e3a8a', '#7c3aed'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    this.sourceChart = new Chart('sourceChart', {
      type: 'doughnut',
      data: {
        labels: ['Website', 'WhatsApp', 'Google', 'Social Media', 'Referral'],
        datasets: [{
          data: [30, 10, 20, 20, 20],
          backgroundColor: ['#c9a84c', '#1e3a8a', '#22c55e', '#7c3aed', '#f97316'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%'
      }
    });
  }

  goToWebsite(): void { this.router.navigateByUrl('/'); }

  loadProperties(): void {
    this.propertyLoading = true;
    this.propertyService.getProperties().subscribe({
      next: (res) => {
        if (res.success) {
          this.properties = res.data;
          this.filteredProperties = res.data;
        }
        this.propertyLoading = false;
      },
      error: () => { this.propertyLoading = false; }
    });
  }

  filterProperties(): void {
    this.filteredProperties = this.properties.filter(p =>
      !this.propertySearchTerm ||
      p.title?.toLowerCase().includes(this.propertySearchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(this.propertySearchTerm.toLowerCase())
    );
  }

  openAddProperty(): void {
    this.editingProperty = null;
    this.propertyForm = {
      title: '', description: '', location: '', estate: '',
      price: null, propertyType: '', transactionType: '',
      bedrooms: null, bathrooms: null, landSize: null,
      featured: false
    };
    this.selectedImageFiles = [];
    this.selectedVideoFiles = [];
    this.imagePreviewUrls = [];
    this.videoPreviewUrls = [];
    this.showPropertyForm = true;
  }

  openEditProperty(property: any): void {
    this.editingProperty = property;
    this.propertyForm = { ...property };
    this.imagePreviewUrls = property.images || [];
    this.videoPreviewUrls = property.videos || [];
    this.showPropertyForm = true;
  }

  closePropertyForm(): void {
    this.showPropertyForm = false;
    this.editingProperty = null;
  }

  onImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    this.selectedImageFiles = Array.from(files);
    this.imagePreviewUrls = [];
    this.selectedImageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviewUrls.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  onVideosSelected(event: any): void {
    const files: FileList = event.target.files;
    this.selectedVideoFiles = Array.from(files);
    this.videoPreviewUrls = this.selectedVideoFiles.map(f => f.name);
  }

  removeImagePreview(index: number): void {
    this.imagePreviewUrls.splice(index, 1);
    this.selectedImageFiles.splice(index, 1);
  }

  saveProperty(): void {
    this.propertySaving = true;

    // Prepare property data object (without files)
    const propertyData = {
      title: this.propertyForm.title,
      description: this.propertyForm.description,
      location: this.propertyForm.location,
      estate: this.propertyForm.estate,
      price: this.propertyForm.price,
      propertyType: this.propertyForm.propertyType,
      transactionType: this.propertyForm.transactionType,
      bedrooms: this.propertyForm.bedrooms ? Number(this.propertyForm.bedrooms) : 0,
      bathrooms: this.propertyForm.bathrooms ? Number(this.propertyForm.bathrooms) : 0,
      landSize: this.propertyForm.landSize ? Number(this.propertyForm.landSize) : 0,
      isFeatured: this.propertyForm.featured || false,
      isAvailable: true
    };

    // Get files
    const featuredImage = this.selectedImageFiles.length > 0 ? this.selectedImageFiles[0] : null;
    const additionalImages = this.selectedImageFiles.slice(1);
    const propertyVideo = this.selectedVideoFiles.length > 0 ? this.selectedVideoFiles[0] : null;

    const request = this.editingProperty
      ? this.propertyService.updateProperty(this.editingProperty.id, propertyData)
      : this.propertyService.createPropertyWithImages(propertyData, featuredImage, additionalImages, propertyVideo);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(this.editingProperty ? 'Property updated!' : 'Property created!');
          this.loadProperties();
          this.closePropertyForm();
        }
        this.propertySaving = false;
      },
      error: (err) => {
        console.error('Save error:', err);
        this.toastr.error('Failed to save property');
        this.propertySaving = false;
      }
    });
  }
  deleteProperty(id: number): void {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    this.propertyService.deleteProperty(id).subscribe({
      next: (res) => { if (res.success) this.loadProperties(); },
      error: () => { }
    });
  }

  formatPrice(price: number): string {
    if (price >= 1000000) return `KES ${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `KES ${(price / 1000).toFixed(0)}K`;
    return `KES ${price}`;
  }

  loadLeads(): void {
    this.leadsLoading = true;
    this.enquiryService.getEnquiries().subscribe({
      next: (res) => {
        if (res.success) {
          this.leads = res.data;
          this.filteredLeads = res.data;
        }
        this.leadsLoading = false;
      },
      error: () => { this.leadsLoading = false; }
    });
  }

  filterLeads(): void {
    this.filteredLeads = this.leads.filter(l => {
      const matchSearch = !this.leadSearch ||
        l.fullName?.toLowerCase().includes(this.leadSearch.toLowerCase()) ||
        l.email?.toLowerCase().includes(this.leadSearch.toLowerCase()) ||
        l.phone?.includes(this.leadSearch);
      const matchStatus = !this.leadStatusFilter || l.status === this.leadStatusFilter;
      const matchType = !this.leadTypeFilter || l.enquiryType === this.leadTypeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }

  updateLeadStatus(lead: any, status: string): void {
    this.enquiryService.updateEnquiryStatus(lead.id, status).subscribe({
      next: (res) => {
        if (res.success) {
          lead.status = status;
          this.filterLeads();
        }
      },
      error: () => { }
    });
  }

  deleteLead(id: number): void {
    if (!confirm('Delete this lead?')) return;
    this.leads = this.leads.filter(l => l.id !== id);
    this.filterLeads();
  }

  openWhatsAppLead(phone: string, name: string): void {
    const msg = encodeURIComponent(`Hello ${name}, this is Jakima Properties following up on your enquiry.`);
    window.open(`https://wa.me/${phone?.replace(/\D/g, '')}?text=${msg}`, '_blank');
  }

  exportLeadsCSV(): void {
    const headers = ['Name', 'Phone', 'Email', 'Type', 'Property', 'Status', 'Date'];
    const rows = this.filteredLeads.map(l => [
      l.fullName, l.phone, l.email, l.enquiryType,
      l.propertyTitle || '', l.status, l.createdAt
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
  }

  saveSettings(): void {
    this.settingsSaved = true;
    setTimeout(() => this.settingsSaved = false, 3000);
  }
}