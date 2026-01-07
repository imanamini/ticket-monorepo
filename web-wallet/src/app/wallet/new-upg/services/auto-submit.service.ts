import { inject, Injectable } from '@angular/core';
import { TicketInfoFeature } from '../../../api/models/tgs-ticket-info.response';
import { ActivatedRoute } from '@angular/router';
import { PaymentMethodService } from '../components/payment-method/services/payment-method.service';
import { BottomSheetService } from './bottom-sheet.service';
import { AutoSubmitConditionType } from '../enums/auto-submit-condition.type';
import { PageEnum } from '../enums/page.enum';
import { FlagEnum } from '../enums/flag.enum';

@Injectable()
export class AutoSubmitService {
  public paymentMethodService = inject(PaymentMethodService);
  private conditionName: AutoSubmitConditionType;
  private bottomSheetService = inject(BottomSheetService);

  public setConfigToAutoSubmit(state: AutoSubmitConditionType): void {
    // In this flow user can't choose a new feature again, so we have to disable bottom sheet dismiss.
    this.conditionName = state;
    if (state) {
      this.bottomSheetService.updateDisableCloseFlag();
    }
  }

  public getState(): AutoSubmitConditionType {
    return this.conditionName;
  }

  public autoSubmitFrom(activatedRoute: ActivatedRoute, features: Array<TicketInfoFeature>): AutoSubmitConditionType {
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
    return (activatedRoute.snapshot.queryParams['page'] === PageEnum.CASH_IN_REDIRECT || activatedRoute.snapshot.queryParams['flag'] === FlagEnum.CASH_IN_REDIRECT);
  }

  private hasFeatureWithTruePreferredGateway(features: Array<TicketInfoFeature>): boolean {
    return Boolean(features.filter((item: TicketInfoFeature) => item.isPreferredGateway === true)[0]);
  }
}
