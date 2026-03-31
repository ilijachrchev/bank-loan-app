import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BankerService } from '../../../core/services/banker.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoanApplication, BankerStats } from '../../../core/models/loan.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-banker-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatTooltipModule,
    StatusBadgeComponent, LoadingSkeletonComponent
  ],
  templateUrl: './banker-dashboard.component.html',
  styleUrls: ['./banker-dashboard.component.scss']
})
export class BankerDashboardComponent implements OnInit {
  private bankerService = inject(BankerService);
  authService = inject(AuthService);

  loading = signal(true);
  statsLoading = signal(true);
  applications = signal<LoanApplication[]>([]);
  stats = signal<BankerStats | null>(null);

  displayedColumns = ['customer', 'type', 'amount', 'status', 'date', 'actions'];

  recentApplications = computed(() => this.applications().slice(0, 10));

  currentUser = this.authService.currentUser;

  ngOnInit() {
    this.bankerService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.statsLoading.set(false);
      },
      error: () => {
        this.statsLoading.set(false);
      }
    });

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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  }
}
