import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanStatus } from '../../../core/models/loan.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClass" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
      <span [class]="dotClass" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
      {{ statusLabel }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status: LoanStatus = 'Pending';

  get statusLabel(): string {
    const labels: Record<LoanStatus, string> = {
      'Pending': 'Pending',
      'UnderReview': 'Under Review',
      'Approved': 'Approved',
      'Rejected': 'Rejected',
      'MoreInfoRequired': 'More Info Required'
    };
    return labels[this.status] || this.status;
  }

  get badgeClass(): string {
    const classes: Record<LoanStatus, string> = {
      'Pending': 'bg-amber-100 text-amber-800',
      'UnderReview': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'MoreInfoRequired': 'bg-orange-100 text-orange-800'
    };
    return classes[this.status] || 'bg-gray-100 text-gray-800';
  }

  get dotClass(): string {
    const classes: Record<LoanStatus, string> = {
      'Pending': 'bg-amber-500',
      'UnderReview': 'bg-blue-500',
      'Approved': 'bg-green-500',
      'Rejected': 'bg-red-500',
      'MoreInfoRequired': 'bg-orange-500'
    };
    return classes[this.status] || 'bg-gray-500';
  }
}
