import { Provider, Type } from '@angular/core';
import { Payment } from '../models/payment.interface';
import { PAYMENT_REGISTRATIONS } from '../helpers/payment.tokens';
import { ProviderKey } from '../../../../components/core/models/fund-schemas';

export function providePayment<T extends Payment>(key: ProviderKey, implClass: Type<T>): Provider[] {
  return [
    implClass,
    {
      provide: PAYMENT_REGISTRATIONS,
      multi: true,
      deps: [implClass],
      useFactory: (impl: T) => ({ key, impl }),
    },
  ];
}
