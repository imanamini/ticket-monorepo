import { Base64 } from 'js-base64';
import { PaymentResultInterface, PaymentResultStatus } from '@client-monorepo/payment/purchase';
import { TicketInfoFeature } from '../../data-access/models/app-pay-features.response';

export class CashInRedirectHandling {
  private decodeCashInRedirectData(base64: string): PaymentResultInterface | null {
    const data: string = base64;
    if (data) {
      const decodedData = decodeURIComponent(data);
      return JSON.parse(Base64.decode(decodedData));
    }
    return null;
  }

  public mapperFeatures(features: Array<TicketInfoFeature>) {
    return features.map((item: TicketInfoFeature) => {
      return item.callbackFeature || item;
    });
  }

  public checkCashInStatus(base64: string): PaymentResultStatus | undefined {
    const decodedData = this.decodeCashInRedirectData(base64);
    return decodedData?.paymentResult;
  }
}
