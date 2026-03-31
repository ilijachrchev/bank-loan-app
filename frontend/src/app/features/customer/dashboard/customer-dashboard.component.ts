import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoanService } from '../../../core/services/loan.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoanApplication } from '../../../core/models/loan.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatTooltipModule,
    StatusBadgeComponent, LoadingSkeletonComponent
  ],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  private loanService = inject(LoanService);
  private authService = inject(AuthService);

  loading = signal(true);
  applications = signal<LoanApplication[]>([]);

  currentUser = this.authService.currentUser;

  displayedColumns = ['type', 'amount', 'status', 'date', 'actions'];

  recentApplications = computed(() => this.applications().slice(0, 5));

  totalCount = computed(() => this.applications().length);
  pendingCount = computed(() => this.applications().filter(a => a.status === 'Pending').length);
  approvedCount = computed(() => this.applications().filter(a => a.status === 'Approved').length);

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
