import { InjectionToken } from '@angular/core';
import { Payment } from '../models/payment.interface';
import { ProviderKey } from '../../../../components/core/models/fund-schemas';

export interface PaymentRegistration {
  key: ProviderKey;
  impl: Payment;
}

export const PAYMENT_REGISTRATIONS = new InjectionToken<PaymentRegistration[]>('PAYMENT_REGISTRATIONS');
