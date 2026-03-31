import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-4">
      <div class="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
        <span class="text-4xl">{{ icon }}</span>
      </div>
      <h3 class="text-xl font-semibold text-slate-700 mb-2">{{ title }}</h3>
      <p class="text-slate-500 text-center max-w-sm mb-6">{{ message }}</p>
      <a *ngIf="actionLink" [routerLink]="actionLink" mat-raised-button
         class="!bg-navy !text-white">
        {{ actionLabel }}
      </a>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon = '📋';
  @Input() title = 'Nothing here yet';
  @Input() message = 'No items to display.';
  @Input() actionLabel = 'Get Started';
  @Input() actionLink: string | null = null;
}
