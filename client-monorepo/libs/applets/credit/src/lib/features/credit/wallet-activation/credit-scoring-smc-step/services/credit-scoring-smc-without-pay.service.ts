import { Injectable } from '@angular/core';
import { CreditScoringSmcStepService } from './credit-scoring-smc-step.service';
import { CreditScoringWithoutPayConfigResponse } from '../../../data-access/models/credit-scoring/basic/credit-scoring-without-pay-config.response';

@Injectable({
  providedIn: 'root',
})
export class CreditScoringSmcWithoutPayService extends CreditScoringSmcStepService {
  config!: CreditScoringWithoutPayConfigResponse | null;

  clearTrackingCode(): void {
    this.trackingCode = null;
  }

  override finishFlow(): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
  }
}
