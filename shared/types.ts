export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type ApplicationStatus = 'Approved' | 'In Review' | 'Rejected';
export interface Scheme {
  id: string;
  title: string;
  description: string;
  type: 'Loan' | 'Subsidy';
  interestRate?: string;
  maxAmount: string;
  eligibility: string;
  icon: 'Tractor' | 'Leaf' | 'Banknote' | 'Factory';
}
export interface Application {
  id: string;
  schemeName: string;
  applicationDate: string;
  amount: number;
  status: ApplicationStatus;
  type: 'Loan' | 'Subsidy';
  events?: ApplicationEvent[];
}
export interface DashboardSummary {
  totalLoanAmount: number;
  totalSubsidiesReceived: number;
  applicationsInReview: number;
  approvedApplications: number;
}
export interface ApplicationEvent {
  date: string;
  status: ApplicationStatus | 'Submitted';
  description: string;
}
export interface AuthUser {
  id: string;
  email: string;
  hashedPassword?: string;
}