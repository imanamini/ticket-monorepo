import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { Installment } from '../../data-access/models/credit/installment/installment';
import { MessageService } from '../../data-access/services/message.service';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { translateOrder } from '../../data-access/utils/strings';
import { FUND_PROVIDER_CODE } from '../../data-access/models/credit/fund-provider/fund-provider-code';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ClickStopPropagationDirective } from '../../data-access/directives/stop-propagation-directive';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'app-credit-installment-item',
  templateUrl: './credit-installment-item.component.html',
  styleUrls: ['./credit-installment-item.component.scss'],
  standalone: true,
  imports: [NgxBadgeModule, NgxIcon, ClickStopPropagationDirective, NgxButtonComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInstallmentItemComponent implements OnInit {
  installment = input<Installment>();

  payableGroup = input<boolean>();

  withoutCard = input<boolean>();

  isSingleInstallment = input<boolean>();

  fundProviderCode = input<number>();

  totalInstallmentCount = input<number>();

  whiteBackground = input(false);

  hidePayCta = input(false);

  title!: string;

  pay = output<void>();

  private messageService = inject(MessageService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);

  ngOnInit(): void {
    this.makeTitle();
  }

  makeTitle() {
    if (this.fundProviderCode() === FUND_PROVIDER_CODE.DIGIPAY && this.totalInstallmentCount()! > 1) {
      this.title = 'قسط ' + translateOrder(this.installment()!.order);
    } else {
      this.title = 'مبلغ ' + (this.isSingleInstallment() ? 'بدهی' : 'قسط');
    }
  }

  onPay(): void {
    if (!this.installment()?.payable) {
      this.messageService.showErrorOfErrorResponse('ابتدا قسط سررسید شده قبلی را پرداخت کنید.');
      return;
    }
    this.pay.emit();
  }

  showTransactionDetail(): void {
    this.router.navigate([this.creditUrlService.getInnerServicePath('/transaction-detail/' + this.installment()!.trackingCode)]);
  }
}
