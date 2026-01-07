import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlanGroup } from '../../../../models/credit/credit-plan-group';
import { PAYMENT_METHOD } from '../../../../models/credit/credit-fund-provider-group-card.model';
import { IranianRialsPipe } from '../../../../ui-pipes/iranian-rials.pipe';
import { UiButtonComponent } from '../../../ui-button/ui-button/ui-button.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

import { ScreenSize } from '../../../../../api/digipay/models/common/screen-size';
import { LayoutService } from '../../../../../website/services/layout.service';

const SubscriptionIconSizeOnMobile = 170;
const SubscriptionIconSizeOnDesktop = 225;

@Component({
  selector: 'app-pre-register-plan-info',
  templateUrl: './pre-register-plan-info.component.html',
  styleUrls: ['./pre-register-plan-info.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, NgClass, UiButtonComponent, UiIconDirective, IranianRialsPipe, NgxIcon],
})
export class PreRegisterPlanInfoComponent implements OnInit {
  @Input() step: any;
  @Input() buttonLink: string;

  @Output() onBack = new EventEmitter();
  @Output() onNext = new EventEmitter();

  info: { title: string; amount: number }[] = [];

  paymentMethod: PAYMENT_METHOD;

  isMobile = false;
  subscriptionIconSize = SubscriptionIconSizeOnDesktop;

  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;

  constructor(private layoutService: LayoutService,) {
    this.layoutService.screenSizeChanged.subscribe(screenSize => this.isMobile = screenSize === ScreenSize.isMobile);
  }

  ngOnInit(): void {
    this.initiateData(this.step.info.selectedPlanGroup);
    this.subscriptionIconSize = this.isMobile ? SubscriptionIconSizeOnMobile : SubscriptionIconSizeOnDesktop;
  }

  initiateData(plan: PlanGroup): void {
    this.paymentMethod = plan.paymentMethod;

    const payableAmount =
      plan.paymentMethod !== PAYMENT_METHOD.SUBSCRIPTION
        ? {
            title: 'مجموع اقساط + هزینه خدمات و زیرساخت',
            amount: plan.payableAmount,
          }
        : {
            title: 'مجموع اقساط + هزینه اشتراک مناسب',
            amount: plan.sumInstallmentAmount + plan.subscriptionDetail.amount,
          };
    const installmentAmount = {
      title: 'مبلغ هر قسط',
      amount: plan.installmentAmount,
    };
    const sumInstallmentAmount = {
      title: 'مجموع اقساط',
      amount: plan.sumInstallmentAmount,
    };
    const totalWage =
      plan.paymentMethod === PAYMENT_METHOD.SUBSCRIPTION
        ? {
            title: `هزینه اشتراک ${plan.subscriptionDetail.title}`,
            amount: plan.subscriptionDetail.amount,
          }
        : {
            title: 'هزینه خدمات و زیرساخت',
            amount: plan.allocationPrepaymentAmount,
          };

    this.info.push(payableAmount, installmentAmount, sumInstallmentAmount, totalWage);
  }

  back() {
    this.onBack.emit();
  }

  next() {
    this.onNext.emit();
  }
}
