import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { LoanService } from '../../../core/services/loan.service';
import { LoanType } from '../../../core/models/loan.model';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatStepperModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, MatSliderModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatDividerModule
  ],
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.scss']
})
export class ApplyLoanComponent {
  private fb = inject(FormBuilder);
  private loanService = inject(LoanService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);

  loanTypes: LoanType[] = ['Personal', 'Home', 'Car', 'Business', 'Education'];

  loanDetailsForm = this.fb.group({
    type: ['Personal' as LoanType, Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(1000), Validators.max(10000000)]],
    purpose: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
    tenure: [12, [Validators.required, Validators.min(6), Validators.max(360)]]
  });

  financialInfoForm = this.fb.group({
    monthlyIncome: [null as number | null, [Validators.required, Validators.min(100)]]
  });

  get tenureValue(): number {
    return this.loanDetailsForm.get('tenure')?.value ?? 12;
  }

  get tenureLabel(): string {
    const months = this.tenureValue;
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years}y ${rem}m` : `${years} years`;
  }

  get emi(): string {
    const amount = this.loanDetailsForm.get('amount')?.value;
    const tenure = this.loanDetailsForm.get('tenure')?.value;
    if (!amount || !tenure) return '—';
    const rate = 0.085 / 12;
    const emi = (amount * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(emi);
  }

  formatCurrency(value: number | null | undefined): string {
    if (!value) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  onSubmit() {
    if (this.loanDetailsForm.invalid || this.financialInfoForm.invalid) return;

    this.loading.set(true);

    const payload = {
      type: ['Personal', 'Home', 'Car', 'Business', 'Education'].indexOf(this.loanDetailsForm.value.type as string),
      amount: this.loanDetailsForm.value.amount!,
      purpose: this.loanDetailsForm.value.purpose!,
      tenure: this.loanDetailsForm.value.tenure!,
      monthlyIncome: this.financialInfoForm.value.monthlyIncome!
    };

    this.loanService.applyForLoan(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Loan application submitted successfully!', 'Close', {
          duration: 5000,
          panelClass: 'success-snack'
        });
        this.router.navigate(['/customer/applications']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || 'Failed to submit application. Please try again.';
        this.snackBar.open(msg, 'Close', {
          duration: 5000,
          panelClass: 'error-snack'
        });
      }
    });
  }
}
