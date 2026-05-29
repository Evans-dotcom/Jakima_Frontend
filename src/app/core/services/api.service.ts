import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(requiresAuth = true): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers: any = { 'Content-Type': 'application/json' };
    if (requiresAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  get<T>(endpoint: string, requiresAuth = false): Observable<any> {
    return this.http.get(`${this.apiUrl}${endpoint}`, { headers: this.getHeaders(requiresAuth) });
  }

  post<T>(endpoint: string, data: any, requiresAuth = true): Observable<any> {
    return this.http.post(`${this.apiUrl}${endpoint}`, data, { headers: this.getHeaders(requiresAuth) });
  }

  put<T>(endpoint: string, data: any, requiresAuth = true): Observable<any> {
    return this.http.put(`${this.apiUrl}${endpoint}`, data, { headers: this.getHeaders(requiresAuth) });
  }

  delete<T>(endpoint: string, requiresAuth = true): Observable<any> {
    return this.http.delete(`${this.apiUrl}${endpoint}`, { headers: this.getHeaders(requiresAuth) });
  }

  patch<T>(url: string, body: any, options?: object): Observable<T> {
    return this.http.patch<T>(url, body, options);
  }

  postFormData<T>(endpoint: string, formData: FormData, requiresAuth = true): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = requiresAuth && token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
    return this.http.post(`${this.apiUrl}${endpoint}`, formData, { headers });
  }
}