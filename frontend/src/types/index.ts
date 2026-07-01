// Matches the backend DTOs exactly

export type Role = 'FOUNDER' | 'INVESTOR' | 'MENTOR' | 'ADMIN' | 'ECOSYSTEM_PARTNER';

export type ApplicationStatus =
  | 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW'
  | 'ELIGIBILITY_PASSED' | 'ELIGIBILITY_FAILED'
  | 'DOCUMENTS_VERIFIED' | 'DOCUMENTS_REJECTED'
  | 'SHORTLISTED' | 'MATCHED' | 'FUNDED' | 'REJECTED' | 'WITHDRAWN';

export type FundingType =
  | 'CROWDFUNDING' | 'FAMILY_AND_FRIENDS' | 'ANGEL_INVESTOR'
  | 'INSTITUTIONAL_VENTURE' | 'GRANT' | 'DEBT_FINANCING';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface FundingOpportunity {
  id: number;
  title: string;
  description: string;
  fundingType: FundingType;
  minAmount: number;
  maxAmount: number;
  currency: string;
  targetSector: string;
  targetCountry: string;
  applicationDeadline: string;
  active: boolean;
}

export interface ApplicationSummary {
  id: number;
  founderName: string;
  businessName: string;
  status: ApplicationStatus;
  fundingType: FundingType;
  fullyEligible: boolean;
  rejectionReason: string | null;
  submittedAt: string;
}

export interface Business {
  id: number;
  businessName: string;
  registrationNumber: string;
  countryOfOperation: string;
  sector: string;
  description: string;
  foundedDate: string;
}
