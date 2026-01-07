import { ICrowdDocument } from './crowd-document.interface';
import { ICrowdEvent } from './crowd-event.interface';

export class CrowdFundingModel {
  id: number;
  title?: string;
  displaySymbol?: string;
  guaranteeType?: string;
  profit?: number;
  investedAlready?: number;
  totalPrice?: number;
  thumbnailLogoAddress?: string;
  bannerImageUrl?: string;
  minimumRequiredPrice?: number;
  successPercentage?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  faraBourseCrowdFundingType?: string;
  description?: string;
  investorsCount?: number;
  minimumAllowedPrice?: number;
  maximumAllowedPercent?: number;
  investmentStartDate?: string;
  investmentEndDate?: string;
  shortDescription?: string;
  companyName?: string;
  profitPercentantage?: number;
  projectDurationInMonth?: number;
  documents?: ICrowdDocument[];
  events?: ICrowdEvent[];
  investmentDeadlineInDays: number;
  symbol?: string;
  customerInvestedAmount?: number;
  provider?: string;
  participantReportFilePath?: string;
  faraBoursePersianSymbol?: string;
  buyable: boolean;
}
