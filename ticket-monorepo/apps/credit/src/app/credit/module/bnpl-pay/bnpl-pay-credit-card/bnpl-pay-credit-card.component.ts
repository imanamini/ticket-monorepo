import { AfterViewInit, Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgClass, NgStyle } from '@angular/common';
import { currencyFormat } from '@digipay/strings';
import { getMonthTitle } from '../../../../utils/date';

interface Installment {
  date: number;
  amount: number;
  order: number;
  feeAmount?: number;
}

interface InstallmentFormatted {
  date: string;
  order: string;
  amountTitle: string;
}

@Component({
  selector: 'app-bnpl-pay-credit-card',
  standalone: true,
  imports: [
    PipesModule,
    NgxIcon,
    NgClass,
    NgStyle
  ],
  templateUrl: './bnpl-pay-credit-card.component.html',
  styleUrl: './bnpl-pay-credit-card.component.scss'
})
export class BnplPayCreditCardComponent implements AfterViewInit {

  totalAmount = input<number>(0);
  fee = input<number>(0);
  installments = input<Installment[]>([]);
  onEditCredit = output();
  detailIsOpen = signal<boolean>(true);
  detailElementHeight = signal<number>(null);

  installmentsFormatted = computed<InstallmentFormatted[]>(() => this.formatInstallments(this.installments()));

  detailElement = viewChild<ElementRef>('detail');

  ngAfterViewInit() {
    this.detailElementHeight.set(this.detailElement()?.nativeElement.offsetHeight);
  }

  toggleMenu() {
    this.detailIsOpen.update(prev => !prev);
  }

  formatInstallments(installments: Installment[]): InstallmentFormatted[] {
    if (installments && installments.length > 0) {
      return installments.map(item => {
          let amountTitle = '';
          if (item.feeAmount) {
            amountTitle =
              currencyFormat(item.amount - item.feeAmount) + ' ریال' +
              ' + ' +
              currencyFormat(item.feeAmount) + ' ریال کارمزد';
          } else {
            amountTitle = currencyFormat(item.amount) + ' ریال';
          }

          return {
            amountTitle,
            date: getMonthTitle(item.date, true),
            order: 'قسط ' + item.order,
          };
        }
      );
    }
  }
}
