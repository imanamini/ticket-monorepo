import { ServicePromotion } from '../../../../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { PaymentSelectFeatureResponse } from '../../../../../../api/digipay/models/payment/payment-select-feature-response';

export interface CompensateServiceCostDialogData {
  serviceName: string;
  serviceImageID: string;
  selectFeatureResponse: PaymentSelectFeatureResponse;
  serviceStep: string;
  serviceCost: number;
  fineTrackingCode?: string;
  servicePromotions: Array<ServicePromotion>;
}
