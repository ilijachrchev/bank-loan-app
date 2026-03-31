import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse space-y-4">
      <ng-container *ngFor="let i of rows">
        <div class="h-16 bg-slate-200 rounded-xl"></div>
      </ng-container>
    </div>
  `
})
export class LoadingSkeletonComponent {
  @Input() count = 5;

  get rows(): number[] {
    return Array(this.count).fill(0);
  }
}
