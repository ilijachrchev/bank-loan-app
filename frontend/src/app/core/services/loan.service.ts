import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoanApplication, ApplyLoanRequest, LoanStatusHistory } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  constructor(private http: HttpClient) {}

  getMyApplications() {
    return this.http.get<LoanApplication[]>(`${environment.apiUrl}/loans/my`);
  }

  applyForLoan(request: ApplyLoanRequest) {
    return this.http.post<LoanApplication>(`${environment.apiUrl}/loans/apply`, request);
  }

  getApplicationById(id: string) {
    return this.http.get<LoanApplication>(`${environment.apiUrl}/loans/${id}`);
  }

  getApplicationHistory(id: string) {
    return this.http.get<LoanStatusHistory[]>(`${environment.apiUrl}/loans/${id}/history`);
  }
}
