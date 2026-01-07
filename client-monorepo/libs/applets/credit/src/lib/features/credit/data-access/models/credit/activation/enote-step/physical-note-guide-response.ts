import { GenericApiResponse } from '../../../generic-api-response.model';

export interface PhysicalNoteGuideResponse extends GenericApiResponse {
  addressInfo: string;
  amount: string;
  amountInLetters: string;
  dateInLetters: string;
  dueDate: string;
  paymentAddressInfo: string;
  personalInfo: string;
  receiverName: string;
  receiverNationalId: string;
  signaturePlace: string;
}
