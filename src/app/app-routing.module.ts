import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'listings',
        loadComponent: () => import('./modules/listings/listings.component').then(m => m.ListingsComponent)
      },
      {
        path: 'property/:id',
        loadComponent: () => import('./modules/property-detail/property-detail.component').then(m => m.PropertyDetailComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./modules/services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./modules/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./modules/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'admin',
        loadComponent: () => import('./modules/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [AuthGuard, AdminGuard]
      }
    ]
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./modules/auth/logins/logins.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./modules/auth/registers/registers.component').then(m => m.RegisterComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }