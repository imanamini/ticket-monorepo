import { GenericApiResponse } from '../../../generic-api-response.model';
import { ChequeDeliveryData } from './cheque-step-delivery.model';

export enum ChequeStatus {
  INITIATED,
  WAITING_TO_UPLOAD,
  PHYSICS_RECEIVED,
  READY_TO_PROCESS,
  IMAGE_ACCEPTED,
  PHYSICS_REJECTED,
  IMAGE_REJECTED,
  COMPLETED,
  PHYSICS_DELIVERY_RESERVED,
  PHYSICS_DELIVERY_HANDLED,
}

export interface ChequeStatusResponse extends GenericApiResponse {
  chequeStatus: ChequeStatus;
  pickupLink: string;
  chequeDeliveryData: ChequeDeliveryData;
}
