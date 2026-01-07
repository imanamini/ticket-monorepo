import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreditPlanDetailResponse, PlanRuleEnum } from '../../../../models/credit/credit-plan-detail.response';
import { CreditApiService } from '../../../../../api/clients/credit/credit-calculator/credit-api.service';
import { PlanGroup } from '../../../../models/credit/credit-plan-group';
import { IranianRialsPipe } from '../../../../ui-pipes/iranian-rials.pipe';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditPageLoadingComponent } from '../../credit-page-loading/credit-page-loading.component';
import { CreditCardComponent } from '../../credit-card/credit-card.component';
import { UiButtonComponent } from '../../../ui-button/ui-button/ui-button.component';
import { PreRegistrationGroupDetailTogglesComponent } from './pre-registration-group-detail-toggles/pre-registration-group-detail-toggles.component';
import { UiScrollableViewComponent } from '../../../ui-scrollable-view/ui-scrollable-view.component';
import { NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../ui-directive/ui-icon.directive';
import { NumberToStringPipe } from '../../../../ui-pipes/number-to-string.pipe';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-pre-registration-group-detail',
  templateUrl: './pre-registration-group-detail.component.html',
  styleUrls: ['./pre-registration-group-detail.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    UiScrollableViewComponent,
    NgFor,
    PreRegistrationGroupDetailTogglesComponent,
    UiButtonComponent,
    UiIconDirective,
    CreditCardComponent,
    CreditPageLoadingComponent,
    PipesModule,
    NumberToStringPipe,
    NgxIcon,
  ],
})
export class PreRegistrationGroupDetailComponent implements OnInit {
  showLoading = true;
  planDetail: CreditPlanDetailResponse;
  @Input() planId: string;
  @Input() groupId: string;
  @Input() step: any;
  @Input() selectedPlanGroup: PlanGroup;

  @Output() onBack = new EventEmitter();
  @Output() onNext = new EventEmitter();
  protected readonly PlanRuleEnum = PlanRuleEnum;

  constructor(private creditApiService: CreditApiService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.showLoading = true;
    this.creditApiService.getPlanDetail(this.planId).subscribe((response) => {
      this.planDetail = response;
      this.planDetail.card.description = new IranianRialsPipe().transform(this.selectedPlanGroup.creditAmount);
      this.showLoading = false;
    });
  }

  isOrderedByMagnitude(maximum: number, minimum: number): boolean {
    if (!minimum || !maximum) {
      return false;
    }
    const decimalOrder = 3;
    const logMax = Math.log10(Math.abs(maximum) || 1);
    const logMin = Math.log10(Math.abs(minimum) || 1);

    return Math.trunc(logMax / decimalOrder) === Math.trunc(logMin / decimalOrder);
  }

  back() {
    this.onBack.emit();
  }

  next() {
    this.onNext.emit();
  }
}
