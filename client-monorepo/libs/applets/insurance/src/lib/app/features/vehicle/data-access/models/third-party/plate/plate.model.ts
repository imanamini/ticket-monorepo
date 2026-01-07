import { CustomerModel } from './customer.model';

export interface PlateModel {
  userId: string;
  plate: string;
  isActive: boolean;
  isValidated: boolean;
  title: string;
  nationalCode: string;
  customer: CustomerModel;
  id: string;
}
