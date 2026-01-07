import { RedirectFormData } from '../../core/services/redirect.service';
import { Purchase, TicketInfoResponse } from '../../api/models/ticket-info.response';
import { PaymentResult } from '../../api/models/payment-result.response';

export abstract class RedirectFormDataModeling {
  private static setRedirectState(keyName: string, obj: any): RedirectFormData {
    return {
      key: keyName,
      value: obj
    };
  }

  public static setPaymentWalletType(state: PaymentResult): Array<RedirectFormData> {
    const result: Array<{ key: string, value: any }> = [];
    if (state.type !== undefined) {
      result.push(RedirectFormDataModeling.setRedirectState('type', state.type));
    }
    return result;
  }

  public static setUserDetailBasedOnPayInfo(state: PaymentResult): Array<RedirectFormData> {
    const result: Array<{ key: string, value: any }> = [];
    if (state.payInfo) {
      const payInfo = state.payInfo;
      if (payInfo.rrn !== undefined) {
        result.push(RedirectFormDataModeling.setRedirectState('rrn', payInfo.rrn));
      }
      if (payInfo.psp !== undefined) {
        result.push(RedirectFormDataModeling.setRedirectState('psp', payInfo.psp));
      }
      if (payInfo.amount !== undefined) {
        result.push(RedirectFormDataModeling.setRedirectState('amount', payInfo.amount));
      }
      if (payInfo.providerId !== undefined) {
        result.push(RedirectFormDataModeling.setRedirectState('providerId', payInfo.providerId));
      }
      if (payInfo.trackingCode !== undefined) {
        result.push(RedirectFormDataModeling.setRedirectState('trackingCode', payInfo.trackingCode));
      }
    }
    return result;
  }

  public static setUserDetailBasedOnPurchase(state: TicketInfoResponse): Array<RedirectFormData> {
    const result: Array<{ key: string, value: any }> = [];
    if (state.purchase) {
      const purchase: Purchase = state.purchase;
      if (purchase.amount !== undefined) {
        result.push(RedirectFormDataModeling.setRedirectState('amount', purchase.amount));
      }
      if (purchase.providerId !== undefined) {
        result.push(RedirectFormDataModeling.setRedirectState('providerId', purchase.providerId));
      }
      if (purchase.trackingCode !== undefined) {
        result.push(RedirectFormDataModeling.setRedirectState('trackingCode', purchase.trackingCode));
      }
    }
    return result;
  }
}
