import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ReactiveFormsModule } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { FundDataService } from '../../../../components/core/services/fund-data.service';
import { PORTFO, RESULT_ROUTE } from '../../../../data-access/constants/app-routes';
import { environment } from '../../../../data-access/environments/environment';
import { ErrorService } from '../../../../components/core/services/error.service';
import { PortfoService } from '../../services/portfo.service';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { WalletBalanceInfoComponent } from '../../components/wallet-balance-info/wallet-balance-info.component';
import { IWalletInfo } from '../../models/wallet-info.interface';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { ActivatedRoute } from '@angular/router';
import { WalletAmountFormComponent } from '../../../wallet/components/wallet-amount-form/wallet-amount-form.component';
import { PaymentHandlerService } from '../../../purchase/services/payment-handler.service';
import { PaymentProcess } from '../../../../shared/services/payment/helpers/payment-process';

@Component({
  selector: 'wealth-applet-cash-in',
  standalone: true,
  imports: [
    CommonModule,

    PipesModule,
    NgxButtonComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxAppBarComponent,
    WalletAmountFormComponent,
    SpinnerComponent,
    WalletBalanceInfoComponent,
  ],
  templateUrl: './cash-in.component.html',
  styleUrl: './cash-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashInComponent implements OnInit {
  isValid = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  showError = signal<boolean>(false);
  amount = signal<string | undefined>(undefined);
  minAmount = signal<number | undefined>(100_000);
  maxAmount = signal<number | undefined>(200_000_0000);
  walletInfo = signal<IWalletInfo[] | undefined>(undefined);

  private location = inject(Location);
  private errorService = inject(ErrorService);
  private portfoService = inject(PortfoService);
  private activatedRoute = inject(ActivatedRoute);
  private paymentProcess = inject(PaymentProcess);
  private fundDataService = inject(FundDataService);
  private navigationService = inject(WealthNavigationService);
  private paymentHandlerService = inject(PaymentHandlerService);

  ngOnInit(): void {
    this.getData();
  }

  onBackHandler() {
    this.navigationService.navigate([PORTFO]);
  }

  amountChanged(data: { value: string; valid: boolean }) {
    this.isValid.set(data.valid);
    this.amount.set(data.value);
  }

  cashin(): void {
    this.isLoading.set(true);

    this.fundDataService
      .walletCashin({
        amount: this.amount(),
        callbackUrl: environment.callbackUrl,
        clientMetadata: `${environment.clientMetadata}?type=CashIn`,
      })
      .subscribe({
        next: (res) => this.handleCashinResponse(res),
        error: () => this.handleCashinError(),
      });
  }

  private handleCashinResponse(res: any): void {
    this.isLoading.set(false);

    if (!res?.success) {
      if (res?.error?.code === ErrorCodes.orderStatusIsNotDraft) {
        this.errorService.setErrorPageExpired(false);
        this.navigationService.navigate([RESULT_ROUTE]);
      }
      return;
    }

    const response = JSON.parse(res.result.params);
    this.location.replaceState(this.navigationService.getCurrentUrl(), `expired=true`);

    const queryParams = this.buildQueryParams(response);
    const url = queryParams ? `${res.result.url}?${queryParams}` : res.result.url;
    window.open(url, '_self');
    this.paymentProcess.openIPG(url);
  }

  private handleCashinError(): void {
    this.isLoading.set(false);
    this.navigationService.navigate([RESULT_ROUTE], {
      queryParams: {
        isSuccess: 'false',
        action: 'cashin',
      },
    });
  }

  private buildQueryParams(paramsObj: Record<string, string>): string {
    return Object.entries(paramsObj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  private mapWalletInfo(result: any): IWalletInfo[] {
    return [
      { title: 'قدرت خرید', value: result?.balance, id: 1 },
      { title: 'موجودی قابل برداشت', value: result?.withdrawalBalance, id: 2 },
    ];
  }

  private getData() {
    const expired = this.activatedRoute.snapshot.queryParams['expired'];
    if (expired) {
      this.navigationService.navigate([RESULT_ROUTE], {
        queryParams: {
          expired: 'true',
          isSuccess: 'false',
          action: 'cashin',
        },
      });
    } else {
      this.portfoService.getWalletInfo().subscribe((res) => {
        this.isLoading.set(false);
        if (res?.success) {
          this.walletInfo.set(this.mapWalletInfo(res.result));
        }
      });
    }
  }
}
