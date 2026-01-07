import { PAYMENT_GATEWAY_MODEL } from '@client-monorepo/common/subscription';

export function generatePayDescription(paymentGateway: PAYMENT_GATEWAY_MODEL[]): string {
  let defaultText = 'درصورت استفاده از ';
  const CPG = ` وام و اعتبار`;
  const WALLET = ` کیف‌پول`;
  const mixPaymentMethod = ` وام و کیف‌پول`;
  paymentGateway.forEach((paymentMethod: PAYMENT_GATEWAY_MODEL) => {
    switch (paymentMethod) {
      case PAYMENT_GATEWAY_MODEL.CPG:
        defaultText += CPG;
        break;
      case PAYMENT_GATEWAY_MODEL.WALLET:
        defaultText += WALLET;
        break;
      case PAYMENT_GATEWAY_MODEL.WALLET && PAYMENT_GATEWAY_MODEL.CPG:
        defaultText += mixPaymentMethod;
        break;
    }
  });
  return defaultText;
}
