import { Component, Input } from '@angular/core';
import { Registering } from '../../../../../../api/clients/models/templates/c-credit/c-credit-template-data';
import { CreditCalculatorV3Component } from '../../../../../../ui/ui-components/ui-credit/credit-calculator-v3/credit-calculator-v3.component';
import { CreditRegisterBenefitsComponent } from '../../../../../../ui/ui-components/ui-credit/credit-register-benefits/credit-register-benefits.component';
import { UserType } from '../../models/user-type-model';
import { UiVerticalFlowComponent } from '../../../../../../ui/ui-components/ui-horizontal-flow/ui-vertical-flow/ui-vertical-flow.component';
import { NgClass, NgIf } from '@angular/common';

interface sectionFlow {
  title?: string;
  steps: any[];
  subtitle?: string;
}

@Component({
  selector: 'app-c-credit-club-registering',
  templateUrl: './c-credit-club-registering.component.html',
  styleUrls: ['./c-credit-club-registering.component.scss'],
  standalone: true,
  imports: [CreditRegisterBenefitsComponent, CreditCalculatorV3Component, UiVerticalFlowComponent, NgClass, NgIf],
})
export class CCreditClubRegisteringComponent {
  @Input() CCreditRegisteringData: Registering;

  @Input() certainFundProviderCode: number;

  @Input() userType: UserType;

  certainCollateral = '';

  @Input() isEntekhab = false;

  entekhabStepper: sectionFlow = {
    steps: [
      {
        title: 'مبلغ و تعداد اقساط رو انتخاب کن',
        text: 'ببین چه مبلغ و چه بازپرداختی برات راحت‌تره. انتخاب با توئه.',
        icon: '/assets/images/entekhab/money.svg',
      },
      {
        title: 'اطلاعات تماس و کدملی‌ت رو وارد کن',
        text: 'فقط چند لحظه زمان می‌بره تا فرم ثبت‌نام رو پر کنی.',
        icon: '/assets/images/entekhab/document-file.svg',
      },
      {
        title: 'تکمیل برگه چک',
        text: 'چک رو طبق دستورالعمل بنویس و تحویل دیجی‌پی یا فروشنده بده.',
        icon: '/assets/images/entekhab/doc2.svg',
      },
      {
        title: 'واریز وام و خرید',
        text: "<p>بعد از اینکه چک به دیجی‌پی برسه، از طریق پیامک بهت اطلاع می‌دیم که وام برات واریز شده و حالا میتونی در <a class='fs-16 blue-color-decoration' href='stores/اسنوا/'>فروشگاهای اسنوا و دوو</a> خرید کنی.</p>",
        icon: '/assets/images/entekhab/wallet.svg',
        html: true,
      },
    ],
  };
}
