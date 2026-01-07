import { IChoosePaymentWay } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { IPOService } from '../../../ipo/services/ipo.service';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { IPayment } from '../../../../components/core/models/payment.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { PaymentHandlerService } from '../../../purchase/services/payment-handler.service';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CHOICE_PAYMENT_METHOD_ROUTE, TERMS_AND_CONDITIONS_ROUTE } from '../../../../data-access/constants/app-routes';

@Component({
  selector: 'wealth-applet-payment-conditions',
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent, NgxCheckboxComponent, SpinnerComponent],
  templateUrl: './payment-conditions.component.html',
  styleUrl: './payment-conditions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentConditionsComponent implements OnInit {
  private ipoService = inject(IPOService);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);
  private paymentHandlerService = inject(PaymentHandlerService);

  loading = signal<boolean>(true);
  agreements = signal<string[]>([]);
  btnLoading = signal<boolean>(false);
  agreementChecked = signal<boolean>(false);
  symbol = signal<string | undefined>(undefined);
  state = signal<IChoosePaymentWay | undefined>(undefined);

  ngOnInit() {
    this.symbol.set(this.activatedRoute.snapshot.paramMap.get('symbol'));
    this.state.set(this.routeState.getAll());

    const state = this.state();
    if (!state?.agreementType) {
      this.onBackHandler();
    } else {
      this.ipoService.getAgreements(this.symbol(), state.agreementType).subscribe((res) => {
        if (res?.success) {
          this.agreements.set(res.result.agreements);
        }
        this.loading.set(false);
      });
      this.paymentHandlerService.loading$.subscribe((res) => {
        this.btnLoading.set(res);
      });
    }
  }

  onToggleAgreement(event: boolean) {
    this.agreementChecked.set(event);
  }

  continue() {
    this.btnLoading.set(true);
    const payment: IPayment = this.generatePaymentData();
    this.paymentHandlerService.setPayment(payment);
    this.paymentHandlerService.paymentConfirm();
  }

  onBackHandler() {
    this.navigationService.navigate([CHOICE_PAYMENT_METHOD_ROUTE, this.symbol()]);
  }

  termsAndConditions() {
    this.navigationService.navigate([TERMS_AND_CONDITIONS_ROUTE]);
  }

  private generatePaymentData(): IPayment {
    const state = this.state();

    return {
      symbol: this.symbol(),
      amount: 0,
      agreementChecked: this.agreementChecked(),
      instrumentUnit: 0,
      units: 0,
      type: 'IPO',
      assetData: state.assetData,
      ipoPaymentMethod: state.agreementType,
    };
  }
}
