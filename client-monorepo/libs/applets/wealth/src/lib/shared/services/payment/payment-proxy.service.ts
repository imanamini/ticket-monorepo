import { Inject, Injectable, Optional } from '@angular/core';
import { IPaymentProxy, Payment } from './models/payment.interface';
import { ProviderKey } from '../../../components/core/models/fund-schemas';
import { PAYMENT_REGISTRATIONS, PaymentRegistration } from './helpers/payment.tokens';

@Injectable({
  providedIn: 'root',
})
export class PaymentProxyService implements IPaymentProxy {
  private readonly registry = new Map<ProviderKey, Payment>();

  constructor(@Optional() @Inject(PAYMENT_REGISTRATIONS) regs: PaymentRegistration[] | null) {
    (regs ?? []).forEach((r) => {
      if (this.registry.has(r.key)) {
        throw new Error(`Duplicate payment registration for key "${r.key}"`);
      }
      this.registry.set(r.key, r.impl);
    });
  }

  impl(key: ProviderKey): Payment {
    const impl = this.registry.get(key);
    if (!impl) {
      const known = [...this.registry.keys()].join(', ') || '(none)';
      throw new Error(`No payment implementation for key "${key}". Known: ${known}`);
    }
    return impl;
  }
}
