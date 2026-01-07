import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

import { Buttons, IconStateType, StateType } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { PRE_PAYMENT_STATUS } from '../../../data-access/models/credit/activation/customer-type/customer-type-status';
import { NgxAlert } from '@digipay/ngx-alert';

const dataMap: {
  [key: number]: {
    pageTitle?: string;
    title: string;
    message: string;
    stateIcon: IconStateType;
    type: StateType;
    buttons: Buttons[];
    alertMessage?: string;
  };
} = {
  [PRE_PAYMENT_STATUS.REJECTED]: {
    title: 'رد توسط بانک',
    message: 'به‌دلیل سیاست‌های اعتباری یا محدودیت‌های عملیاتی بانک، در حال حاضر امکان پرداخت این وام وجود ندارد.',
    stateIcon: 'error',
    type: 'Status',
    buttons: [
      {
        id: 'prePaymentRejectedContinueButton',
        mode: 'form',
        label: ' متوجه شدم',
        fullWidth: true,
        style: 'fill',
      },
    ],
  },
  [PRE_PAYMENT_STATUS.DELAYED]: {
    title: 'در انتظار بررسی بانک',
    message: 'ما در حال بررسی پرونده وام شما هستیم. تا روز {{days}} دیگر، پرونده شما برای بانک ارسال می‌شود',
    stateIcon: 'info',
    type: 'Status',
    alertMessage: 'توجه کنید در صورت داشتن چک برگشتی و اقساط معوق در این مدت درخواست شما از جانب بانک رد میشود',
    buttons: [
      {
        id: 'prePaymentReadyToApproveConfirmButton',
        mode: 'form',
        label: ' متوجه شدم',
        fullWidth: true,
        style: 'fill',
      },
    ],
  },
  [PRE_PAYMENT_STATUS.READY_TO_APPROVE]: {
    title: 'در انتظار تایید بانک',
    message:
      'پرداخت شما با موفقیت انجام شد و مدارکتان برای بانک ارسال شده است. طی ۷۲ ساعت کاری آینده نتیجه تایید مدارک را از طریق پیامک به شما اطلاع می دهیم.',
    stateIcon: 'info',
    type: 'Status',
    buttons: [
      {
        id: 'prePaymentDelayedConfirmButton',
        mode: 'form',
        label: ' متوجه شدم',
        fullWidth: true,
        style: 'fill',
      },
    ],
  },
};

@Component({
  selector: 'app-credit-pre-payment-state',
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent, NgxAlert],
  templateUrl: './credit-pre-payment-state.component.html',
  styleUrl: './credit-pre-payment-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPrePaymentStateComponent {
  status = input<PRE_PAYMENT_STATUS>();
  dailyRemainingDays = input<number>(0);

  iconState = computed<IconStateType>(() => dataMap[this.status()!].stateIcon);
  buttons = computed<Buttons[]>(() => dataMap[this.status()!].buttons);
  title = computed(() => dataMap[this.status()!].title);
  description = computed(() => dataMap[this.status()!].message.replace('{{days}}', this.dailyRemainingDays().toString()));
  alertMessage = computed(() => dataMap[this.status()!].alertMessage);

  closeStep = output();
}
