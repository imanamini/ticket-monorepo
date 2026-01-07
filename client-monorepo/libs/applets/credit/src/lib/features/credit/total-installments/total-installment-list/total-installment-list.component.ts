import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormattedInstallmentsShowModel } from '../models/formatted-installments-show.model';
import { AggregationInstallmentFields } from '../../data-access/models/credit/installment/installment';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { InstallmentDetailComponent } from '../installment-detail/installment-detail.component';
import { MessageService } from '../../data-access/services/message.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditAggregationBottomComponent } from '../../credit-wallet-detail/credit-aggregation-bottom/credit-aggregation-bottom.component';
import { TotalInstallmentCardComponent } from '../total-installment-card/total-installment-card.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';

type InstallmentType = 'DUE' | 'CURRENT';

@Component({
  selector: 'app-total-installment-list',
  templateUrl: './total-installment-list.component.html',
  styleUrl: './total-installment-list.component.scss',
  standalone: true,
  imports: [CreditScrollableViewComponent, TotalInstallmentCardComponent, CreditAggregationBottomComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalInstallmentListComponent implements OnInit {
  installments = input<FormattedInstallmentsShowModel | null>(null);

  installmentStates = signal<boolean[]>([]);
  totalPayableAmount = signal<number>(0);
  isDesktop = signal<boolean | null>(null);

  private bottomSheet = inject(NgxBottomSheetService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private messageService = inject(MessageService);
  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver.observe(['(min-width: 614px)']).subscribe((result) => {
      this.isDesktop.set(result.matches);
    });
  }

  ngOnInit() {
    this.initInstallmentStates();
    this.setPayableAmount();
  }

  initInstallmentStates() {
    const temp: boolean[] = [];
    this.installments()?.dueInstallments?.forEach((ins, i) => {
      temp.push(true);
    });
    this.installments()?.currentInstallments?.forEach((ins, i) => {
      temp.push(false);
    });
    this.installmentStates.set(temp);
  }

  handleCheckedChange($event: boolean, index: number) {
    this.installmentStates.update((prev) => {
      const newStates = [...prev];
      newStates[index] = $event;
      return newStates;
    });
    if (!$event) {
      this.uncheckNextInstallments(index);
    }
    this.setPayableAmount();
  }

  uncheckNextInstallments(index: number) {
    this.installmentStates.update((prev) =>
      prev.map((item, i) => {
        return i >= index ? false : item;
      }),
    );
  }

  setPayableAmount() {
    const dueStates = this.installmentStates().slice(0, this.installments()?.dueInstallments?.length);
    const currentStates = this.installmentStates().slice(this.installments()?.dueInstallments?.length);
    const dueSelectedInstallmentAmount = this.calculateSelectedAmount('DUE', dueStates);
    const currentSelectedInstallmentAmount = this.calculateSelectedAmount('CURRENT', currentStates);
    this.totalPayableAmount.set(dueSelectedInstallmentAmount + currentSelectedInstallmentAmount);
  }

  calculateSelectedAmount(installmentType: InstallmentType, statesArray: boolean[]) {
    if (installmentType === 'DUE') {
      return statesArray.reduce((prev, current, i) => {
        return current ? prev + this.installments()?.dueInstallments![i].amount! : prev;
      }, 0);
    } else {
      return statesArray.reduce((prev, current, i) => {
        return current ? prev + this.installments()?.currentInstallments![i].amount! : prev;
      }, 0);
    }
  }

  onLockedClickHandler(hasPenalty: boolean) {
    const message: string = hasPenalty
      ? 'بازپرداخت بدهی‌های دارای جریمه الزامی‌ست'
      : 'اولویت پرداخت اقساط بالاتر بیشتر است. لطفا این اولویت‌بندی را در انتخاب آن‌ها رعایت کنید.';
    this.messageService.showWarnMessage(message);
  }

  openDetail(installmentType: InstallmentType, installmentIndex: number) {
    const installment =
      installmentType === 'DUE'
        ? this.installments()?.dueInstallments![installmentIndex]
        : this.installments()?.currentInstallments![installmentIndex];

    this.bottomSheet.openBottomSheet(InstallmentDetailComponent, {
      installment: installment!,
    });
  }

  pay() {
    const paymentConfigPayload: AggregationInstallmentFields[] = [];
    const dueStates = this.installmentStates().slice(0, this.installments()?.dueInstallments?.length);
    const currentStates = this.installmentStates().slice(this.installments()?.dueInstallments?.length);

    dueStates.forEach((state, i) => {
      if (state) {
        const installment = this.installments()?.dueInstallments![i];
        const paymentConfigPayloadItemIndex = paymentConfigPayload.findIndex(
          (config) => config.trackingCode === installment?.contract.contractTrackingCode,
        );

        if (paymentConfigPayloadItemIndex > -1) {
          paymentConfigPayload[paymentConfigPayloadItemIndex].amount += installment?.amount!;
          paymentConfigPayload[paymentConfigPayloadItemIndex].count += 1;
        } else {
          paymentConfigPayload.push({
            trackingCode: installment?.contract.contractTrackingCode!,
            count: 1,
            amount: installment?.amount!,
          });
        }
      }
    });

    currentStates.forEach((state, i) => {
      if (state) {
        const installment = this.installments()?.currentInstallments![i];
        const paymentConfigPayloadItemIndex = paymentConfigPayload.findIndex(
          (config) => config.trackingCode === installment?.contract.contractTrackingCode,
        );

        if (paymentConfigPayloadItemIndex > -1) {
          paymentConfigPayload[paymentConfigPayloadItemIndex].amount += installment?.amount!;
          paymentConfigPayload[paymentConfigPayloadItemIndex].count += 1;
        } else {
          paymentConfigPayload.push({
            trackingCode: installment?.contract.contractTrackingCode!,
            count: 1,
            amount: installment?.amount!,
          });
        }
      }
    });

    const paymentConfigPayloadString = JSON.stringify(paymentConfigPayload);
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/installment/pay?options=${paymentConfigPayloadString}`)).then();
  }
}
