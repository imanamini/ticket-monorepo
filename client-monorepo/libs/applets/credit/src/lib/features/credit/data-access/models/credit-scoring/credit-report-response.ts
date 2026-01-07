import { GenericApiResponse } from '../generic-api-response.model';

export interface CreditReportResponse extends GenericApiResponse {
  details: string[];
  trackingCode: string;
  personalDetail: CreditReportPersonalDetail;
  contracts: CreditReportContract[];
  summary: CreditReportSummary;
  chequeStatus: CreditReportChequeStatus;
  notes: string;
}

export interface CreditReportChequeStatus {
  status: string;
  color: number;
}

export interface CreditReportContract {
  creditorName: string;
  creditorImage: string;
  totalDebt: number;
  outstandingDebt: number;
  totalNumOfInstallments?: number;
  outstandingNumOfInstallments?: number;
  start: string;
  end?: string;
}

export interface CreditReportPersonalDetail {
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
  cellNumber: string;
  gender: number;
  birthDate: string;
  birthPlace: string;
  phones: string[];
  address: string;
}

export interface CreditReportSummary {
  score: number;
  dishonoredChequeCount: string;
  customsDebt: string;
  taxDebt: string;
  justiceDepartment: string;
  creditScore: string;
  icsScore: string;
  spectrum: CreditReportSpectrum[];
  scores: { title: string; value: string }[];
  totalScore: { title: string; value: string };
}

export interface CreditReportSpectrum {
  min: number;
  max: number;
  color: number;
  riskDesk: string;
  scoreDesc: string;
  icon: string;
}
