import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoSubmitConditionType } from '../models/auto-submit-condition.type';
import { PageEnum } from '../models/page.enum';
import { FlagEnum } from '../models/flag.enum';
import { PaymentMethodService } from './payment-method.service';
import { TicketInfoFeature } from '../models/app-pay-features.response';

@Injectable({
  providedIn: 'root',
})
export class AutoSubmitService {
  public paymentMethodService = inject(PaymentMethodService);
  private conditionName!: AutoSubmitConditionType;
  isRedirectCashIn = signal(false);

  public setConfigToAutoSubmit(state: AutoSubmitConditionType): void {
    // In this flow user can't choose a new feature again, so we have to disable bottom sheet dismiss.
    this.conditionName = state;
  }

  public getState(): AutoSubmitConditionType {
    return this.conditionName;
  }

  public autoSubmitFrom(activatedRoute: ActivatedRoute, features: Array<TicketInfoFeature>): AutoSubmitConditionType | null {
    if (this.singleFeature(features)) {
      return 'SINGLE_FEATURE';
    }
    if (this.hasFeatureWithTruePreferredGateway(features)) {
      return 'PREFERRED_GATEWAY';
    }
    if (this.userRedirectedFromCashIn(activatedRoute)) {
      return 'REDIRECT_CASH_IN';
    }
    return null;
  }

  private singleFeature(features: Array<TicketInfoFeature>): boolean {
    return features.length === 1;
  }

  private userRedirectedFromCashIn(activatedRoute: ActivatedRoute): boolean {
    return (
      activatedRoute.snapshot.queryParams['page'] === PageEnum.CASH_IN_REDIRECT ||
      activatedRoute.snapshot.queryParams['flag'] === FlagEnum.CASH_IN_REDIRECT
    );
  }

  private hasFeatureWithTruePreferredGateway(features: Array<TicketInfoFeature>): boolean {
    return Boolean(features.filter((item: TicketInfoFeature) => item.isPreferredGateway)[0]);
  }
}
