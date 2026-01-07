import { ICustomerAgreement } from './customer-agreement.interface';
import { EVerifyCustomerState } from './verify-customer-state.enum';

export interface IVerifyCustomer {
  state: EVerifyCustomerState;
  agreements: ICustomerAgreement[];
}
