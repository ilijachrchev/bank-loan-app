import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { LoanService } from '../../../core/services/loan.service';
import { LoanApplication, LoanStatus } from '../../../core/models/loan.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatChipsModule,
    StatusBadgeComponent, LoadingSkeletonComponent
  ],
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss']
})
export class ApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private loanService = inject(LoanService);

  loading = signal(true);
  application = signal<LoanApplication | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loanService.getApplicationById(id).subscribe({
      next: (data) => {
        this.application.set(data);
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

  getStatusIcon(status: LoanStatus): string {
    const icons: Record<LoanStatus, string> = {
      'Pending': 'schedule',
      'UnderReview': 'find_in_page',
      'Approved': 'check_circle',
      'Rejected': 'cancel',
      'MoreInfoRequired': 'help_outline'
    };
    return icons[status] || 'info';
  }

  getStatusColor(status: LoanStatus): string {
    const colors: Record<LoanStatus, string> = {
      'Pending': 'text-amber-500',
      'UnderReview': 'text-blue-500',
      'Approved': 'text-green-500',
      'Rejected': 'text-red-500',
      'MoreInfoRequired': 'text-orange-500'
    };
    return colors[status] || 'text-slate-500';
  }

  get tenureLabel(): string {
    const months = this.application()?.tenure ?? 0;
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years}y ${rem}m` : `${years} years`;
  }
}
