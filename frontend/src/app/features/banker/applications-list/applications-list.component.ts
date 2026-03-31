import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BankerService } from '../../../core/services/banker.service';
import { LoanApplication, LoanStatus } from '../../../core/models/loan.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatTooltipModule,
    StatusBadgeComponent, LoadingSkeletonComponent, EmptyStateComponent
  ],
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss']
})
export class ApplicationsListComponent implements OnInit {
  private bankerService = inject(BankerService);

  loading = signal(true);
  applications = signal<LoanApplication[]>([]);
  searchQuery = signal('');
  selectedStatus = signal<LoanStatus | 'All'>('All');
  pageIndex = signal(0);
  pageSize = signal(10);

  displayedColumns = ['customer', 'type', 'amount', 'status', 'date', 'actions'];

  statusFilters: { label: string; value: LoanStatus | 'All'; color: string }[] = [
    { label: 'All', value: 'All', color: '' },
    { label: 'Pending', value: 'Pending', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'Under Review', value: 'UnderReview', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: 'Approved', value: 'Approved', color: 'text-green-700 bg-green-50 border-green-200' },
    { label: 'Rejected', value: 'Rejected', color: 'text-red-700 bg-red-50 border-red-200' },
    { label: 'More Info', value: 'MoreInfoRequired', color: 'text-orange-700 bg-orange-50 border-orange-200' }
  ];

  filteredApplications = computed(() => {
    let apps = this.applications();
    const query = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();

    if (query) {
      apps = apps.filter(a =>
        a.customerName.toLowerCase().includes(query) ||
        a.customerEmail.toLowerCase().includes(query) ||
        a.type.toLowerCase().includes(query) ||
        a.purpose.toLowerCase().includes(query)
      );
    }

    if (status !== 'All') {
      apps = apps.filter(a => a.status === status);
    }

    return apps;
  });

  pagedApplications = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredApplications().slice(start, start + this.pageSize());
  });

  ngOnInit() {
    this.bankerService.getApplications().subscribe({
      next: (data) => {
        this.applications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  }
}
