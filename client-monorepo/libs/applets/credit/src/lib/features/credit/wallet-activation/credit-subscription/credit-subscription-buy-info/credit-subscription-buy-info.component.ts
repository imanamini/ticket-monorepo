import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { SubscriptionDetail } from '../../../data-access/models/credit/activation/subscription/subscription-status.response';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { SelectionBoxComponent } from '../../../components/selection-box/selection-box.component';
import { ListOption } from '../../../data-access/models/credit/profile/credit-profile-response.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditSubscriptionBuyPecuniaryConfirmBottomSheetComponent } from '../credit-subscription-buy-pecuniary-confirm-bottom-sheet/credit-subscription-buy-pecuniary-confirm-bottom-sheet.component';
import { CreditSubscriptionBuyCreditConfirmBottomSheetComponent } from '../credit-subscription-buy-credit-confirm-bottom-sheet/credit-subscription-buy-credit-confirm-bottom-sheet.component';
import { ALLOCATION_PAYMENT_METHOD } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxAlert } from '@digipay/ngx-alert';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'app-credit-subscription-buy-info',
  templateUrl: './credit-subscription-buy-info.component.html',
  styleUrls: ['./credit-subscription-buy-info.component.scss'],
  imports: [
    NgxButtonComponent,
    NgxStatusResultModule,
    NgxTrackableIdDirective,
    PipesModule,
    SelectionBoxComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    NgxDividerComponent,
    NgxAlert,
    NgxCalloutComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionBuyInfoComponent implements OnInit {
  description = {
    CREDIT: 'کسر از وام',
    PECUNIARY: 'پرداخت نقدی',
  };

  loading = signal(false);
  paymentOptions = signal<ListOption[]>([
    {
      label: null,
      value: 'PECUNIARY',
      selected: true,
      iconLabel: 'bank-card',
    },
    {
      label: null,
      value: 'CREDIT',
      selected: false,
      iconLabel: 'bank-card-receive',
    },
  ]);

  selectedOption = signal<ListOption | undefined>(undefined);

  subscriptionDetail = input<SubscriptionDetail>();

  pecuniaryCreditEnabled = computed(
    () => this.subscriptionDetail()?.allocationPaymentMethodType === ALLOCATION_PAYMENT_METHOD.PECUNIARY_CREDIT,
  );

  totalAmount = computed(
    () =>
      (this.subscriptionDetail()?.initialBalance || 0) -
      (this.selectedOption()?.value === 'CREDIT' ? this.subscriptionDetail()?.amount || 0 : 0) -
      (this.subscriptionDetail()?.stampPrice || 0),
  );

  buttonLabel = computed(() => (this.selectedOption()?.value === 'CREDIT' ? 'تایید و ادامه' : 'تایید و پرداخت هزینه اشتراک'));

  nextStep = output<void>();
  initiateSubscription = output<ALLOCATION_PAYMENT_METHOD>();
  prevStep = output<void>();

  bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    this.selectedOption.set(this.paymentOptions()[0]);
  }

  selectOption(item?: any, index?: number) {
    const clonedOptions = JSON.parse(
      JSON.stringify(
        this.paymentOptions().map((option: ListOption, i) => {
          const newItem = { ...option };
          newItem.selected = false;
          if (option && i === index) {
            newItem.selected = true;
          }
          return newItem;
        }),
      ),
    );
    this.paymentOptions.set(clonedOptions);
    this.selectedOption.set(item);
  }

  openPayByCreditConfirmBottomSheet() {
    this.bottomSheetService.openBottomSheet(CreditSubscriptionBuyCreditConfirmBottomSheetComponent, this.subscriptionDetail(), {
      noPadding: true,
    });

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (result && result.confirmed) {
        this.loading.set(true);
        this.initiateSubscription.emit(ALLOCATION_PAYMENT_METHOD.PECUNIARY_CREDIT);
      }
    });
  }

  openPayPecuniaryConfirmBottomSheet() {
    this.bottomSheetService.openBottomSheet(
      CreditSubscriptionBuyPecuniaryConfirmBottomSheetComponent,
      {},
      {
        noPadding: true,
      },
    );

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (result && result.confirmed) {
        this.loading.set(true);
        this.initiateSubscription.emit(ALLOCATION_PAYMENT_METHOD.PECUNIARY);
      }
    });
  }

  onNext() {
    if (this.selectedOption()?.value === 'CREDIT') {
      this.openPayByCreditConfirmBottomSheet();
    } else {
      this.openPayPecuniaryConfirmBottomSheet();
    }
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
}
