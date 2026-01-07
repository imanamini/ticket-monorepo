import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "src/app/core/http/api.service";

@Injectable()
export class WalletManagementGiftCardApiService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  redeemVouchers(voucherCode: number, token: string) {
    return this.post("gift-cards/vouchers/redeem", null, {
      headers: {
        authorization: `bearer ${token}`,
      },
      params: new HttpParams({
        fromObject: {
          voucherCode,
        },
      }),
    });
  }
}
