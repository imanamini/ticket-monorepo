import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { CreditFundProviderGroupCardModel } from './credit-fund-provider-group-card.model';
import { PAYMENT_METHOD } from '../../../data-access/models/credit/pre-registration/payment-method.model';
import { PlanRuleEnum } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { LowerCasePipe, NgTemplateOutlet } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditNumberToStringPipe } from '../../../data-access/pipes/credit-number-to-string.pipe';
import { SERVICE_TYPE } from '../../../data-access/models/credit/service-type/service-type.model';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-fund-provider-groups-card',
  templateUrl: './credit-fund-provider-groups-card.component.html',
  styleUrls: ['./credit-fund-provider-groups-card.component.scss'],
  imports: [
    NgxButtonComponent,
    NgxDividerComponent,
    NgxTooltipDirective,
    NgTemplateOutlet,
    NgxSkeletonLoadingComponent,
    LowerCasePipe,
    NgxTrackableIdDirective,
    PipesModule,
    CreditNumberToStringPipe,
    CreditDigipayImageComponent,
    NgxCalloutComponent,
    NgxIcon,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditFundProviderGroupsCardComponent implements OnInit {
  data = input<CreditFundProviderGroupCardModel>();

  prePaymentDescription = signal(
    'این مبلغ شامل هزینه‌های تسهیل‌گری خدمات دریافت وام ' +
      '(ایجاد و توسعه زیرساخت‌ها، انجام فرآیندها، عملیات پشتیبانی، توسعه و نگه‌داری محصول و ..) است.',
  );
  totalPayableDescription = signal('مجموع اقساط + هزینه خدمات و زیر‌ساخت');
  collateralTitle = signal<string | null>(null);

  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;
  protected readonly PlanRuleEnum = PlanRuleEnum;
  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly SERVICE_TYPE = SERVICE_TYPE;

  ngOnInit(): void {
    if (this.data() && this.data()?.interestPercentage) {
      this.totalPayableDescription.set('مجموع اقساط + هزینه خدمات و زیر‌ساخت');
    } else {
      this.totalPayableDescription.set('کل مبلغ بازپرداخت');
    }
    this.collateralTitle.set(
      this.data()
        ?.collaterals.map((item) => item.name)
        .join(' یا ')!,
    );
  }
}
