import {Component, inject, OnInit} from '@angular/core';
import {OtpComponent} from "../../otp/otp.component";
import {ApiResult} from "../../../../../api/models/api-result";
import {CAndPPayService} from "../c-and-p-pay.service";
import {CashInBackService} from "../cash-in-back.service";
import {PageEnum} from "../../../enums/page.enum";
import {WalletApiService} from "../../../../../api/wallet-api.service";
import {TgsSelectFeatureResponse} from "../../../../../api/models/tgs-select-feature-response";

@Component({
  selector: 'app-c-p-otp',
  templateUrl: './c-p-otp.component.html',
  styleUrls: ['./c-p-otp.component.scss']
})
export class CPOtpComponent extends OtpComponent implements OnInit {
  private CAndPPayService = inject(CAndPPayService);
  public cashInBackService = inject(CashInBackService);
  private walletApi = inject(WalletApiService);
  public info: TgsSelectFeatureResponse;

  async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.info = await this.featureInformationService.getLatestSelectedFeatureInfo(this.selectedFeatureName);
    this.createCashInInitiateFlag();
  }

  public verifyingCode(otp: string): void {
    if (otp.length < 6) {
      return;
    }
    this.invalidMessage = null;
    this.verificationService.verifyOtp(otp, [this.selectedFeatureName])
      .then(() => {
        this.CAndPPayService.navigateToPay(this.info.payUrl);
      }, (error: ApiResult) => {
        if (this.invalidOtp(error) === false) {
          this.handleErrorService.check(error);
        }
      });
  }

  public back(): void {
    const page: PageEnum = this.activatedRoute.snapshot.queryParams['page'];
    this.checkValidationChargeableAmount().then((isValidAmount: boolean) => {
      this.cashInBackService.backBasedOnScreen(page, isValidAmount);
    }).catch(()=>{
      console.log('خطایی رخ داده است!')
    })
  }

  private async checkValidationChargeableAmount(): Promise<boolean> {
    return (this.info?.amount - this.info?.walletBalance) >= this.info?.cashInAmount;
  }

  private createCashInInitiateFlag(): void {
    this.walletApi.walletFlag(this.ticketInfoService.ticket , 'ICP').subscribe();
  }
}
