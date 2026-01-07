import { TicketInfoFeature } from '../../../../api/models/tgs-ticket-info.response';
import { PaymentResult } from '../../../../api/models/payment-result.response';
import { Decoder } from '../../../../utils/decoder';
import { PaymentResultEnum } from '../../../../api/emuns/payment-result.enum';

export class CashInRedirectHandling {

  private decodeCashInRedirectData(base64: string): PaymentResult {
    const data: string = base64;
    if (data) {
      return Decoder(data);
    }
    return null;
  }

  public mapperFeatures(features: Array<TicketInfoFeature>) {
    return features.map((item: TicketInfoFeature) => {
      return item.callbackFeature || item;
    });
  }

  public checkCashInStatus(base64: string): PaymentResultEnum {
    const decodedData: PaymentResult = this.decodeCashInRedirectData(base64);
    const status: PaymentResultEnum = decodedData.paymentResult;
    return status;
  }
}
