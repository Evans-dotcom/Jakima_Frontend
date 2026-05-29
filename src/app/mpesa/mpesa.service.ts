import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
  callBackURL: string;
  userId?: number;
  kpiId?: number;
}

export interface STKPushResponse {
  merchantRequestID: string;
  checkoutRequestID: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
  success: boolean;
}

export interface MpesaTransaction {
  id: number;
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
  merchantRequestID: string;
  checkoutRequestID: string;
  resultCode: string;
  resultDesc: string;
  mpesaReceiptNumber: string;
  transactionDate: string;
  status: string;
  paymentMode: string;
  userId?: number;
  kpiId?: number;
  createdAt: string;
}

export interface TransactionStatus {
  checkoutRequestID: string;
  status: string;
  resultCode: string;
  resultDesc: string;
  mpesaReceiptNumber: string;
  amount: number;
  phoneNumber: string;
  transactionDate: string;
  accountReference: string;
}

@Injectable({ providedIn: 'root' })
export class MpesaService {
  private baseUrl = `${environment.apiUrl}/Mpesa`;

  constructor(private http: HttpClient) {}

  testToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/test-token`);
  }

  checkConfig(): Observable<any> {
    return this.http.get(`${this.baseUrl}/check-config`);
  }

  initiateSTKPush(request: STKPushRequest): Observable<STKPushResponse> {
    return this.http.post<STKPushResponse>(`${this.baseUrl}/stkpush`, request);
  }

  getTransaction(id: number): Observable<{ success: boolean; data: MpesaTransaction }> {
    return this.http.get<{ success: boolean; data: MpesaTransaction }>(`${this.baseUrl}/transactions/${id}`);
  }

  getUserTransactions(userId: number): Observable<{ success: boolean; count: number; data: MpesaTransaction[] }> {
    return this.http.get<{ success: boolean; count: number; data: MpesaTransaction[] }>(`${this.baseUrl}/transactions/user/${userId}`);
  }

  getTransactionStatus(checkoutRequestId: string): Observable<{ success: boolean; data: TransactionStatus }> {
    return this.http.get<{ success: boolean; data: TransactionStatus }>(`${this.baseUrl}/status/${checkoutRequestId}`);
  }

  getAllTransactions(page = 1, pageSize = 20, status?: string): Observable<{ success: boolean; data: MpesaTransaction[] }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (status) params = params.set('status', status);
    return this.http.get<{ success: boolean; data: MpesaTransaction[] }>(`${this.baseUrl}/transactions`, { params });
  }
}