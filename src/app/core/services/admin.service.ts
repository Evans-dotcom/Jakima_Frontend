import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private api: ApiService) {}

  getRoles(): Observable<any> {
    return this.api.get('/admin/roles');
  }

  createRole(roleName: string): Observable<any> {
    return this.api.post(`/admin/roles?roleName=${roleName}`, {});
  }

  deleteRole(roleId: number): Observable<any> {
    return this.api.delete(`/admin/roles/${roleId}`);
  }

  getUsers(): Observable<any> {
    return this.api.get('/admin/users');
  }

  getUserWithRoles(userId: number): Observable<any> {
    return this.api.get(`/admin/users/${userId}`);
  }

  assignRole(userId: number, roleName: string): Observable<any> {
    return this.api.post(`/admin/users/${userId}/roles/${roleName}`, {});
  }

  removeRole(userId: number, roleName: string): Observable<any> {
    return this.api.delete(`/admin/users/${userId}/roles/${roleName}`);
  }

  toggleUserStatus(userId: number): Observable<any> {
    return this.api.patch(`/admin/users/${userId}/toggle-status`, {});
  }
}