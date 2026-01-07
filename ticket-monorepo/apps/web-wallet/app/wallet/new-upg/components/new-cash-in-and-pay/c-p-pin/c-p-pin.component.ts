import {Component, inject, OnInit} from '@angular/core';
import {PinComponent} from "../../pin/pin.component";
import {finalize} from "rxjs";
import {ApiResult} from "../../../../../api/models/api-result";
import {CAndPPayService} from '../c-and-p-pay.service';
import {CashInBackService} from "../cash-in-back.service";
import {PageEnum} from "../../../enums/page.enum";
import {TgsSelectFeatureResponse} from "../../../../../api/models/tgs-select-feature-response";

@Component({
  selector: 'app-c-p-pin',
  templateUrl: './c-p-pin.component.html',
  styleUrls: ['./c-p-pin.component.scss']
})
export class CPPinComponent extends PinComponent implements OnInit {
  private CAndPPayService = inject(CAndPPayService);
  public cashInBackService = inject(CashInBackService);
  public info: TgsSelectFeatureResponse;

  async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.info = await this.featureInformationService.getLatestSelectedFeatureInfo(this.selectedFeatureName);
    this.createCashInInitiateFlag();
  }

  override login(pin: string): void {
    if (pin.length < 4) {
      return;
    }
    this.loadingSubmit = true;
    this.invalidMessage = null;
    this.walletApiService.loginUser(this.user.userId, pin, [this.selectedFeatureName], this.ticketInfoService.ticket)
      .pipe(finalize(() => this.loadingSubmit = false)).subscribe(
      async () => {
        this.CAndPPayService.navigateToPay(this.info.payUrl);
      },
      (errorResponse: ApiResult) => {
        if (this.invalidPin(errorResponse) === false) {
          this.handleErrorService.check(errorResponse);
        }
      }
    );
  }

  private async checkValidationChargeableAmount(): Promise<boolean> {
    return (this.info?.amount - this.info?.walletBalance) >= this.info?.cashInAmount;
  }

  public back(): void {
    const page: PageEnum = this.activatedRoute.snapshot.queryParams['page'];
    this.checkValidationChargeableAmount().then((isValidAmount: boolean) => {
      this.cashInBackService.backBasedOnScreen(page, isValidAmount);
    }).catch(() => {
      console.log('خطایی رخ داده است!')
    })
  }

  private createCashInInitiateFlag(): void {
    this.walletApiService.walletFlag(this.ticketInfoService.ticket , 'ICP').subscribe();
  }
}
