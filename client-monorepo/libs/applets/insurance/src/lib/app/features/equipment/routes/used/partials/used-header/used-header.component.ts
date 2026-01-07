import { Component, inject, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { UsedHeaderButtonModes } from './models/used-header-button.modes';
import { SharedUsedService } from '../../services/shared-used.service';
import { UsedHeaderDataModel } from './models/used-header-data.model';
import { Router } from '@angular/router';
import { UsedHeaderActionButtonModel } from './models/used-header-action-button.model';
import { ReferrerService } from '../../../../../../data-access/services/referrer.service';
import { NgxIcon } from '@digipay/ngx-icon';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { FaqService } from '../../../../../../data-access/services/faq.service';
import { FaqCategoryTypeEnum } from '../../../../../../data-access/enums/faq-category-type.enum';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsuranceUrlsEnum } from '../../../../../../data-access/enums/insurance-urls.enum';

@Component({
  selector: 'used-header',
  templateUrl: './used-header.component.html',
  standalone: true,
  imports: [
    NgxIcon
  ],
  styleUrls: ['./used-header.component.scss']
})
export class UsedHeaderComponent implements OnDestroy {

  protected readonly IconEnum = IconEnum;
  private faqService = inject(FaqService);

  constructor(private sharedService: SharedUsedService,
              private router: Router,
              private referrerService: ReferrerService
  ) {
  }

  readonly JourneyNamesModel = JourneyNamesModel;
  readonly HeaderButtonModes = UsedHeaderButtonModes;

  @Input()
  isMobile: boolean;
  @Input()
  state: number;

  @Input()
  headerData: UsedHeaderDataModel;

  @Input()
  showMoreDetail: boolean;

  subscriptions: Subscription[] = [];

  handleBackClick(): void {
    if (this.headerData.backClickHandler) {
      this.headerData.backClickHandler();
    } else {
      this.sharedService.setBackClick();
    }
  }

  handleCustomBtnClick(item: UsedHeaderActionButtonModel): void {
    if (item.mode === UsedHeaderButtonModes.PROFILE) {
      this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyList}`], {
        queryParams: {
          referrer: this.referrerService.referrer,
          type: 'digital-equipment'
        }
      }).then();
    } else {
      item.clickHandler();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  handleFAQClicked(): void {
    this.faqService.open(FaqCategoryTypeEnum.EQUIPMENT);
  }
}
