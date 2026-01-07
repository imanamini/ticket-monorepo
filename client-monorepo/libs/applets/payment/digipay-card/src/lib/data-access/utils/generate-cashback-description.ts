import { PAYMENT_GATEWAY_MODEL } from '@client-monorepo/common/subscription';
import { PlanServiceDescription } from '../models/plan-service-config.model';

export function generateCashbackDescription(paymentGateway: PAYMENT_GATEWAY_MODEL[], businessTitle: string): PlanServiceDescription {
  const withoutAmountType = {
    text: `دریافت هدیه نقدی برای خرید از ${businessTitle} درصورت استفاده از`,
    keywords: [''],
  };
  const CPG = ` وام و اعتبار`;
  const WALLET = ` کیف‌پول`;
  const mixPaymentMethod = ` وام و کیف‌پول`;
  paymentGateway.forEach((paymentMethod: PAYMENT_GATEWAY_MODEL) => {
    switch (paymentMethod) {
      case PAYMENT_GATEWAY_MODEL.CPG:
        withoutAmountType.text += CPG;
        withoutAmountType.keywords.push(CPG);
        break;
      case PAYMENT_GATEWAY_MODEL.WALLET:
        withoutAmountType.text += WALLET;
        withoutAmountType.keywords.push(WALLET);
        break;
      case PAYMENT_GATEWAY_MODEL.WALLET && PAYMENT_GATEWAY_MODEL.CPG:
        withoutAmountType.text += mixPaymentMethod;
        withoutAmountType.keywords.push(mixPaymentMethod);
        break;
      default:
    }
  });
  return withoutAmountType;
}
