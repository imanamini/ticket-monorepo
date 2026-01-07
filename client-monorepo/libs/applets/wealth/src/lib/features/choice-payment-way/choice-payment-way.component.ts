import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { EIpoPaymentMethodAgreement, IChoosePaymentWay, IPaymentMethod } from './models';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { IPO_ROUTE, PAYMENT_METHOD_CONDITIONS_ROUTE } from '../../data-access/constants/app-routes';

@Component({
  selector: 'wealth-applet-choice-payment-way',
  standalone: true,
  imports: [NgxAppBarComponent, NgxButtonComponent, NgxRadioButtonComponent],
  templateUrl: './choice-payment-way.component.html',
  styleUrl: './choice-payment-way.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoicePaymentWayComponent implements OnInit {
  route = inject(ActivatedRoute);
  routeState = inject(RouteStateService);
  navigationService = inject(WealthNavigationService);

  paymentMethods = signal<IPaymentMethod[]>([
    {
      id: EIpoPaymentMethodAgreement.ByCredit,
      title: 'سرمایه‌گذاری با اعتبار کارگزاری',
      description:
        'در این روش کارگزاری به شما اعتبار می‌دهد. شما ۵ روز فرصت دارید با شارژ کیف پول ETF خود در سبد دارایی این بدهی را بپردازید، در غیر این صورت کارگزاری سهام را فروخته و بعد از کسر بدهی، باقی‌مانده مبلغ را به کیف پول ETF شما واریز می‌کند.',
    },
    {
      id: EIpoPaymentMethodAgreement.ByCharge,
      title: 'سرمایه‌گذاری از طریق درگاه بانکی',
      description:
        'شما مبلغ سرمایه‌گذاری را در درگاه بانکی پرداخت خواهید کرد. اگر مبلغ نهایی شده خرید کمتر از مبلغ پرداختی شما باشد، باقی‌مانده آن به کیف پول ETF شما واریز خواهد شد.',
    },
  ]);
  state = signal<IChoosePaymentWay | undefined>(undefined);
  selectedMethodId = signal<EIpoPaymentMethodAgreement>(this.paymentMethods()[0].id);

  symbol = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.symbol.set(this.route.snapshot.paramMap.get('id'));
  }

  onBackHandler() {
    this.navigationService.navigate([IPO_ROUTE, this.symbol()]);
  }

  continue() {
    this.navigationService.navigate([PAYMENT_METHOD_CONDITIONS_ROUTE, this.symbol()], {
      state: {
        ...this.state(),
        agreementType: this.selectedMethodId(),
      },
    });
  }
}
