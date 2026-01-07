import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { ButtonStyle, NgxButtonComponent } from '@digipay/ngx-button';

import { RiskBarComponent } from '../risk-bar/risk-bar.component';
import { FundStatisticsComponent } from '../fund-statistics/fund-statistics.component';
import { takeUntil } from 'rxjs';

import { ImageComponent } from '../../../../../shared/components/image/image.component';
import { BaseComponent } from '../../../../../components/core/components/base/base.component';
import { ErrorService } from '../../../../../components/core/services/error.service';
import { InstrumentService } from '../../../../../components/core/services/instrument.service';
import {
  INVESTMENT_LIST_ROUTE,
  OFF_TIME_ERROR_ROUTE,
  PROVIDER_CAPACITY_FULL_ROUTE,
  PURCHASE_ROUTE,
} from '../../../../../data-access/constants/app-routes';
import { EIntrackEventName } from '../../../../../components/core/models/intrack-event-name.enum';
import { InstrumentOfftimeReason } from '../../../../../data-access/enums/instrument-offtime-reason';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ActivatedRoute, Params } from '@angular/router';
import { UserInfoModel } from '../../../../user-profile/models/user-info.model';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { DecimalPipe, NgClass } from '@angular/common';
import { IFundList } from 'libs/applets/wealth/src/lib/components/core/models/fund-schemas';

@Component({
  selector: 'app-funds-list-item',
  standalone: true,
  imports: [
    PipesModule,
    ImageComponent,
    NgxBadgeModule,
    RiskBarComponent,
    NgxButtonComponent,
    FundStatisticsComponent,
    DecimalPipe,
    NgClass,
  ],
  templateUrl: './funds-list-item.component.html',
  styleUrl: './funds-list-item.component.scss',
})
export class FundsListItemComponent extends BaseComponent implements OnInit {
  fund = input.required<IFundList>();
  ready = input.required<boolean>();

  detailButton: IActionButton = { id: 'DETAIL_', title: 'جزییات', style: 'tinted-on-elevated' };
  purchaseButton: IActionButton = { id: 'BUY_', title: 'سرمایه‌گذاری', style: 'fill' };

  actionButtons = computed<IActionButton[]>(() => {
    const buttons: IActionButton[] = [];
    buttons.push(this.detailButton);
    if (this.fund().buyable) {
      buttons.push(this.purchaseButton);
    }
    return buttons;
  });

  qParams = signal<Params | undefined>(undefined);
  user = signal<UserInfoModel | undefined>(undefined);

  profitBadgeText = computed(() => {
    return this.fund().profitType === 'CompoundProfit' ? 'بازده مرکب ' : 'بازده سالانه ';
  });

  private errorService = inject(ErrorService);
  private activatedRoute = inject(ActivatedRoute);
  private eventService = inject(NgxEventTrackerService);
  private instrumentService = inject(InstrumentService);
  private navigationService = inject(WealthNavigationService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.qParams.set(this.activatedRoute.snapshot.queryParams);
  }

  goToDetail() {
    this.navigationService.navigate([INVESTMENT_LIST_ROUTE, this.fund().symbol], {
      state: {
        referrer: this.qParams()['referrer'],
      },
    });
  }

  goToBuy() {
    this.eventService.sendEvent({
      eventName: EIntrackEventName.BUY_INVESTMENT_SELECT,
      eventData: {
        FundId: this.fund().symbol,
      },
    });

    this.navigationService.navigate([PURCHASE_ROUTE, this.fund().symbol], {
      state: {
        type: this.fund().type,
        investmentType: this.fund()?.investmentType,
        referrer: this.qParams()['referrer'],
      },
    });

    // TODO: Dubble check to remove
    // this.instrumentService
    //   .isAvailable(this.fund().symbol, 'BUY')
    //   .pipe(takeUntil(this.destroyObservable))
    //   .subscribe((res) => {
    //     if (res.result?.isAvailable) {
    //       this.navigationService.navigate([PURCHASE_ROUTE, this.fund().symbol], {
    //         state: {
    //           type: this.fund().type,
    //           investmentType: this.fund()?.investmentType,
    //           referrer: this.qParams()['referrer'],
    //         },
    //       });
    //     } else {
    //       if (res?.result?.unavailabilityReason == InstrumentOfftimeReason.NOTBUYABLE) {
    //         this.navigationService.navigate([PROVIDER_CAPACITY_FULL_ROUTE]);
    //       } else if (res?.result?.unavailabilityReason == InstrumentOfftimeReason.OFFTIME) {
    //         this.errorService.setParams({
    //           description: res.result.noticeMessage,
    //           title: res.result.noticeTitle,
    //         });
    //         this.navigationService.navigate([OFF_TIME_ERROR_ROUTE]);
    //       }
    //     }
    //   });
  }
}

interface IActionButton {
  title: string;
  id: string;
  style: ButtonStyle;
}
