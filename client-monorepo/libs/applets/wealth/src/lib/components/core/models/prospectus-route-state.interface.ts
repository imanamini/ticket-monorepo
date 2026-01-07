import { EpdfType } from './instruments.enum';

export interface IProspectusRouteState {
  symbol?: string;
  amount?: string;
  agreementChecked?: boolean;
  type?: string;
  backToProfile?: boolean;
  agreement?: string;
  agreementTitle?: string;
  pdfType?: EpdfType;
  pdfFile?: Blob;
  investmentType?: string;
  assetData?: any;
  campaignData?: any;
  selectedOption?: string;
}
