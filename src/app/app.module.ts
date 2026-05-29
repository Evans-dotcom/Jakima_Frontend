import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { JwtInterceptor } from "./core/interceptors/jwt.interceptor";
import { ErrorInterceptor } from "./core/interceptors/error.interceptor";
import { LoadingInterceptor } from "./core/interceptors/loading.interceptor";
import { AppComponent } from "./app.component";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { ToastrModule } from "ngx-toastr";
import { SharedModule } from "./shared/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { MomentModule } from "ngx-moment";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

// Import standalone components
import { HomeComponent } from "./modules/home/home.component";
import { ListingsComponent } from "./modules/listings/listings.component";
import { PropertyDetailComponent } from "./modules/property-detail/property-detail.component";
import { ServicesComponent } from "./modules/services/services.component";
import { AboutComponent } from "./modules/about/about.component";
import { ContactComponent } from "./modules/contact/contact.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LoginComponent } from "./modules/auth/logins/logins.component";
import { RegisterComponent } from "./modules/auth/registers/registers.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";

@NgModule({
  declarations: [
    MainLayoutComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      timeOut: 5000
    }),
    NgxSpinnerModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        m: 59
      }
    }),
    // Standalone components
    HomeComponent,
    ListingsComponent,
    PropertyDetailComponent,
    ServicesComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }