import { inject, Injectable } from '@angular/core';
import { SectionCardModel } from '../../../../../../data-access/models/section-card.model';
import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { AlertColorEnum } from '../../../../../../data-access/enums/alert-color.enum';
import { Router } from '@angular/router';
import { PolicyApiService } from '../../../../../vehicle/data-access/services/third-party/policy-api.service';

@Injectable({
  providedIn: 'root',
})
export abstract class PolicyDetailService {
  router = inject(Router);
  policyApiService = inject(PolicyApiService);

  nullDate = '-';
  infoText = '';
  activeButtonText = '';
  alertColor: AlertColorEnum = AlertColorEnum.Blue;
  id = '';
  payable = 0;

  abstract getPolicyDetail(id: string): Promise<SectionCardModel[]>;

  abstract showMajorActionButton(): boolean;

  abstract getMajorActionButtonText(): string;

  abstract majorActionButtonHandler(): void;

  abstract showMinorActionButton(): boolean;

  abstract getMinorActionButtonText(): string;

  abstract minorActionButtonHandler(): void;

  abstract hasMoreActions(): boolean;

  abstract moreActionsHandler(): void;

  abstract hasPriceConflict(): boolean;

  getInfoText(): string {
    return this.infoText;
  }

  getAlertColor(): AlertColorEnum {
    return this.alertColor;
  }

  transformPrice(price: number): string {
    return price ? new SeparateThousandsPipe().priceFormat(price / 10, ',') + ' تومان' : this.nullDate;
  }
}
