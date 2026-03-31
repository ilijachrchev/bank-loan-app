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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoanService } from '../../../core/services/loan.service';
import { LoanApplication, LoanStatus } from '../../../core/models/loan.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule,
    MatChipsModule, MatTooltipModule,
    StatusBadgeComponent, LoadingSkeletonComponent, EmptyStateComponent
  ],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {
  private loanService = inject(LoanService);

  loading = signal(true);
  applications = signal<LoanApplication[]>([]);
  searchQuery = signal('');
  selectedStatus = signal<LoanStatus | 'All'>('All');

  displayedColumns = ['type', 'amount', 'purpose', 'status', 'date', 'actions'];

  statusFilters: { label: string; value: LoanStatus | 'All' }[] = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Under Review', value: 'UnderReview' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'More Info', value: 'MoreInfoRequired' }
  ];

  filteredApplications = computed(() => {
    let apps = this.applications();
    const query = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();

    if (query) {
      apps = apps.filter(a =>
        a.type.toLowerCase().includes(query) ||
        a.purpose.toLowerCase().includes(query)
      );
    }

    if (status !== 'All') {
      apps = apps.filter(a => a.status === status);
    }

    return apps;
  });

  ngOnInit() {
    this.loanService.getMyApplications().subscribe({
      next: (data) => {
        this.applications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  }
}
