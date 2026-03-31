export type LoanType = 'Personal' | 'Home' | 'Car' | 'Business' | 'Education';
export type LoanStatus = 'Pending' | 'UnderReview' | 'Approved' | 'Rejected' | 'MoreInfoRequired';

export interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  type: LoanType;
  purpose: string;
  tenure: number;
  monthlyIncome: number;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
  statusHistory?: LoanStatusHistory[];
  notes?: BankerNote[];
}

export interface LoanStatusHistory {
  id: string;
  status: LoanStatus;
  note?: string;
  changedBy: string;
  changedAt: string;
}

export interface BankerNote {
  id: string;
  bankerId: string;
  bankerName: string;
  note: string;
  createdAt: string;
}

export interface ApplyLoanRequest {
  amount: number;
  type: LoanType;
  purpose: string;
  tenure: number;
  monthlyIncome: number;
}

export interface UpdateStatusRequest {
  status: LoanStatus;
  note?: string;
}

export interface AddNoteRequest {
  note: string;
}

export interface BankerStats {
  totalApplications: number;
  pendingCount: number;
  underReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  moreInfoRequiredCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
