import { MerchantCashbackList, PAYMENT_GATEWAY_MODEL } from '@client-monorepo/common/subscription';
import { PlanServiceDescription } from './models/plan-service-config.model';

export function concatPayMethod(merchantCashbackLists: MerchantCashbackList[]): any {
  const defaultText: PlanServiceDescription = {
    text: 'برگشت ‌پول برای خرید از فروشگاه‌های منتخب دیجی‌پی درصورت استفاده از',
    keywords: [''],
  };
  const uniquePaymentGateways: PAYMENT_GATEWAY_MODEL[] = [...new Set(merchantCashbackLists.flatMap((item) => item.paymentGateway))];
  const CPG = ` وام و اعتبار`;
  const WALLET = ` کیف‌پول`;
  const mixPaymentMethod = ` وام و کیف‌پول`;
  uniquePaymentGateways.forEach((paymentMethod: PAYMENT_GATEWAY_MODEL) => {
    switch (paymentMethod) {
      case PAYMENT_GATEWAY_MODEL.CPG:
        defaultText.text += CPG;
        defaultText.keywords.push(CPG);
        break;
      case PAYMENT_GATEWAY_MODEL.WALLET:
        defaultText.text += WALLET;
        defaultText.keywords.push(WALLET);
        break;
      case PAYMENT_GATEWAY_MODEL.WALLET && PAYMENT_GATEWAY_MODEL.CPG:
        defaultText.text += mixPaymentMethod;
        defaultText.keywords.push(mixPaymentMethod);
        break;
      default:
    }
  });
  return defaultText;
}
