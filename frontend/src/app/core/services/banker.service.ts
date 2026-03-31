import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoanApplication, BankerNote, BankerStats, UpdateStatusRequest, AddNoteRequest } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class BankerService {
  constructor(private http: HttpClient) {}

  getApplications(params?: { status?: string; search?: string }) {
    let httpParams = new HttpParams();
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<LoanApplication[]>(`${environment.apiUrl}/banker/applications`, { params: httpParams });
  }

  getApplicationById(id: string) {
    return this.http.get<LoanApplication>(`${environment.apiUrl}/banker/applications/${id}`);
  }

  updateStatus(id: string, request: UpdateStatusRequest) {
    return this.http.put<LoanApplication>(`${environment.apiUrl}/banker/applications/${id}/status`, request);
  }

  addNote(id: string, request: AddNoteRequest) {
    return this.http.post<BankerNote>(`${environment.apiUrl}/banker/applications/${id}/notes`, request);
  }

  getNotes(id: string) {
    return this.http.get<BankerNote[]>(`${environment.apiUrl}/banker/applications/${id}/notes`);
  }

  getStats() {
    return this.http.get<BankerStats>(`${environment.apiUrl}/banker/stats`);
  }
}
