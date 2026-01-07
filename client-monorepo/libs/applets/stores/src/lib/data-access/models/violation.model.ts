import { ViolationPurchaseStatus } from '../constants/violation.const';
import { IFileUpload } from '@digipay/ngx-uploader/lib/data-access/models/uploader.interface';
import { StoreType } from '@client-monorepo/stores';
import { PurchaseModel } from '@client-monorepo/payment/purchase';

export interface ViolationPurchaseStatusModel {
  id: string;
  title: string;
  status: ViolationPurchaseStatus;
}

export interface ViolationReasonModel {
  title: string;
  icon?: {
    name: string;
    iconType?: 'bold' | 'linear' | 'due';
    iconSize?: string;
  };
  items: { text: string; clicked: boolean }[];
  summaryFields?: { title: string; field: string }[];
}

export interface ViolationDataModel {
  purchaseStatus?: ViolationPurchaseStatus;
  reasons?: string[];
  purchase?: PurchaseModel;
  purchaseType?: string;
  PaymentMethod?: StoreType;
  documents?: ViolationDocumentsModel;
}

export interface ViolationReasonSummaryModel {
  status?: ViolationPurchaseStatus;
  store?: string;
  storeImageId?: string;
  referrerMethodTitle?: string;
  date?: number;
  price?: number;
}

export interface ViolationBottomSheetItemModel {
  id: string;
  title: string;
  storeType: StoreType;
}

export interface ViolationDocumentsModel {
  description?: string;
  files: IFileUpload[];
}
