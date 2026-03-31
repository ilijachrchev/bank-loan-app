import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BankerService } from '../../../core/services/banker.service';
import { LoanApplication, LoanStatus, BankerNote } from '../../../core/models/loan.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-banker-application-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDividerModule,
    MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule,
    StatusBadgeComponent, LoadingSkeletonComponent, ConfirmDialogComponent
  ],
  templateUrl: './banker-application-detail.component.html',
  styleUrls: ['./banker-application-detail.component.scss']
})
export class BankerApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bankerService = inject(BankerService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  loading = signal(true);
  actionLoading = signal(false);
  noteSubmitting = signal(false);
  application = signal<LoanApplication | null>(null);
  notes = signal<BankerNote[]>([]);

  noteForm = this.fb.group({
    note: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadApplication(id);
    this.loadNotes(id);
  }

  private loadApplication(id: string) {
    this.bankerService.getApplicationById(id).subscribe({
      next: (data) => {
        this.application.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private loadNotes(id: string) {
    this.bankerService.getNotes(id).subscribe({
      next: (data) => this.notes.set(data),
      error: () => {}
    });
  }

  updateStatus(status: LoanStatus, actionLabel: string) {
    const app = this.application();
    if (!app) return;

    const dialogData: ConfirmDialogData = {
      title: `${actionLabel} Application`,
      message: `Are you sure you want to ${actionLabel.toLowerCase()} this loan application for ${app.customerName}?`,
      confirmText: actionLabel,
      cancelText: 'Cancel',
      confirmColor: status === 'Approved' ? 'primary' : status === 'Rejected' ? 'warn' : 'accent'
    };

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px',
      panelClass: 'rounded-dialog'
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      // Prompt for note
      const note = prompt(`Add a note for this ${actionLabel.toLowerCase()} (optional):`);

      this.actionLoading.set(true);
      this.bankerService.updateStatus(app.id, { status, note: note || undefined }).subscribe({
        next: (updated) => {
          this.application.set(updated);
          this.actionLoading.set(false);
          this.snackBar.open(`Application ${actionLabel.toLowerCase()}d successfully!`, 'Close', {
            duration: 4000,
            panelClass: 'success-snack'
          });
        },
        error: (err) => {
          this.actionLoading.set(false);
          const msg = err?.error?.message || 'Failed to update status. Please try again.';
          this.snackBar.open(msg, 'Close', {
            duration: 4000,
            panelClass: 'error-snack'
          });
        }
      });
    });
  }

  addNote() {
    if (this.noteForm.invalid) return;
    const app = this.application();
    if (!app) return;

    this.noteSubmitting.set(true);
    this.bankerService.addNote(app.id, { note: this.noteForm.value.note! }).subscribe({
      next: (note) => {
        this.notes.update(notes => [...notes, note]);
        this.noteForm.reset();
        this.noteSubmitting.set(false);
        this.snackBar.open('Note added successfully!', 'Close', {
          duration: 3000,
          panelClass: 'success-snack'
        });
      },
      error: () => {
        this.noteSubmitting.set(false);
        this.snackBar.open('Failed to add note.', 'Close', {
          duration: 3000,
          panelClass: 'error-snack'
        });
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

  get canApprove(): boolean {
    const s = this.application()?.status;
    return s === 'Pending' || s === 'UnderReview' || s === 'MoreInfoRequired';
  }

  get canReject(): boolean {
    const s = this.application()?.status;
    return s === 'Pending' || s === 'UnderReview' || s === 'MoreInfoRequired';
  }

  get canMarkUnderReview(): boolean {
    return this.application()?.status === 'Pending';
  }

  get canRequestMoreInfo(): boolean {
    const s = this.application()?.status;
    return s === 'Pending' || s === 'UnderReview';
  }
}
