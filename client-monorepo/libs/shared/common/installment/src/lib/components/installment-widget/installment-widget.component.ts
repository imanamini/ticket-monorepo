import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { INSTALLMENT_WIDGET_STATES } from '../../data-access/consts/installment-widget-states.const';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { InstallmentInfoCardComponent } from '../installment-info-card/installment-info-card.component';
import { PenaltyInstallmentCardComponent } from '../penalty-installment-card/penalty-installment-card.component';
import { InstallmentWidgetDataService } from '../../data-access/services/installment-widget-data.service';
import { InstallmentDisplayData, InstallmentPayment } from '../../data-access/models/installment-display-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SERVICE_TYPE } from '@client-monorepo/payment/transactions';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { InstallmentDetailDialogComponent } from '../installment-detail-dialog/installment-detail-dialog.component';
import { areAllSamePaymentType } from '../../utils/installment-helper';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { AppNameService } from '@client-monorepo/common/utilities';
import { CallbackInstallmentsOverviewKey } from '@client-monorepo/applets/credit';

@Component({
  selector: 'common-installment-installment-widget',
  standalone: true,
  imports: [CommonModule, PipesModule, InstallmentInfoCardComponent, PenaltyInstallmentCardComponent],
  templateUrl: './installment-widget.component.html',
  styleUrl: './installment-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.d-none]': '!showWidget()',
    '[class.penalty-mode]': 'displayData()?.displayState === INSTALLMENT_WIDGET_STATES.PENALTY_ACTIVE',
  },
})
export class InstallmentWidgetComponent implements OnInit {
  private readonly actionHandlerService = inject(ActionHandlerService);
  private readonly installmentWidgetDataService = inject(InstallmentWidgetDataService);
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  destroyRef = inject(DestroyRef);
  private eventManagementService = inject(EventManagementService);
  private eventTrackerService = inject(NgxEventTrackerService);
  private appNameService = inject(AppNameService);

  // Inputs
  readonly bottomOffset = input<number>(0);
  readonly padding = input<string>('');

  // Component state
  readonly isLoading = signal<boolean>(true);
  readonly displayData = signal<InstallmentDisplayData | null>({
    displayState: INSTALLMENT_WIDGET_STATES.OVERDUE,
    totalAmount: 0,
    hasPenalty: false,
    date: null,
    daysRemaining: 0,
    itemCount: 0,
    items: [],
    bnplCount: 0,
    creditCount: 0,
  });

  // Expose constants
  readonly INSTALLMENT_WIDGET_STATES = INSTALLMENT_WIDGET_STATES;

  readonly showWidget = computed(() => {
    return !this.isLoading() && this.displayData();
  });

  // UI-specific computed properties
  readonly containerClasses = computed(() => {
    const isPenaltyActive = this.displayData()?.displayState === INSTALLMENT_WIDGET_STATES.PENALTY_ACTIVE;
    return {
      'payment-container': true,
      'w-100': true,
      'penalty-fixed': isPenaltyActive,
      '--toast-padding': !!this.padding(),
      loading: this.isLoading(),
    };
  });

  readonly containerStyles = computed(() => {
    const isPenaltyActive = this.displayData()?.displayState === INSTALLMENT_WIDGET_STATES.PENALTY_ACTIVE;
    return isPenaltyActive
      ? {
          '--bottom-offset': `${this.bottomOffset()}px`,
        }
      : {};
  });

  readonly installmentMode = computed(() => (this.displayData()?.itemCount && this.displayData()!.itemCount > 1 ? 'multi' : 'single'));

  readonly penaltyCount = computed(() => {
    const penaltyList = this.displayData()?.hasPenalty
      ? this.displayData()?.items.filter((item) => item.payload.contractDebts.penaltyAmount > 0)
      : [];
    return penaltyList?.length;
  });

  readonly widgetTitle = computed(() => {
    const items = this.displayData()?.items || [];
    if (items.length === 1) {
      return items[0].payload.serviceType === SERVICE_TYPE.CREDIT ? 'قسط وام' : 'قسط اعتبار';
    } else if (areAllSamePaymentType(items, SERVICE_TYPE.BNPL)) {
      return 'اقساط اعتبار';
    } else if (areAllSamePaymentType(items, SERVICE_TYPE.CREDIT)) {
      return 'اقساط وام';
    } else {
      return 'اقساط وام و اعتبار';
    }
  });

  ngOnInit(): void {
    this.loadPaymentData();
  }

  private loadPaymentData(noCache = false): void {
    this.isLoading.set(true);
    this.installmentWidgetDataService
      .getInstallmentData(noCache)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.displayData.set(data);
          this.isLoading.set(false);

          // Track InstallmentCardView event when card is displayed
          if (this.appNameService.isPillar() && data) {
            this.eventTrackerService.sendEvent({
              eventName: 'InstallmentCardView',
              eventData: {},
            });
          }
        },
        error: (error) => {
          console.error('Failed to load payment data:', error);
          this.isLoading.set(false);
        },
      });
  }

  handlePayment(): void {
    const items = this.displayData()?.items || [];

    if (items.length === 0) return;

    // Track installment card click event
    if (this.appNameService.isPillar()) {
      console.log('Pillar_InstallmentCardClick');
      this.eventTrackerService.sendEvent({
        eventName: 'Pillar_InstallmentCardClick',
        eventData: {},
      });
    }

    if (items.length === 1) {
      this.handleSinglePayment(items[0]);
    } else if (areAllSamePaymentType(items, SERVICE_TYPE.BNPL)) {
      this.handleMultipleBnplPayments();
    } else if (areAllSamePaymentType(items, SERVICE_TYPE.CREDIT)) {
      this.handleMultipleCreditPayments();
    } else {
      this.showInstallmentDetail();
    }
  }

  private handleSinglePayment(item: InstallmentPayment, referrer = 'widget'): void {
    const penaltyAmount = item.payload.contractDebts.penaltyAmount;
    const params: Record<string, string> = {
      referrer: penaltyAmount > 0 ? 'widgetfine-Single-Pay' : 'widget-Single-Pay',
      rfr: 'hub',
      [CallbackInstallmentsOverviewKey]: encodeURIComponent('/'),
    };
    if (referrer === 'bottom-sheet') {
      if (item.payload.serviceType === SERVICE_TYPE.CREDIT) {
        params['referrer'] = penaltyAmount > 0 ? 'Bottom-sheet-fine-credit' : 'Bottom-sheet-widget-credit';
      } else {
        params['referrer'] = penaltyAmount > 0 ? 'Bottom-sheet-fine-Single-Pay' : 'Bottom-sheet-widget-Single-Pay';
      }
    }

    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['installment-widget'],
      data: {
        target: `installment-widget: ${item.payload.serviceType}`,
      },
      meta: JSON.stringify(params),
    });
    this.actionHandlerService.handle({
      type: ActionType.PAY_INSTALLMENT,
      payload: {
        params,
        serviceType: item.payload.serviceType,
        creditId: item.payload?.creditId,
        ticketDetail: item.payload.contractDebts.ticketDetail,
      },
    });
  }

  private handleMultipleBnplPayments(referrer = 'widget'): void {
    const bnplItems = this.displayData()?.items.filter((item) => item.payload.serviceType === SERVICE_TYPE.BNPL) || [];
    const bnplHasPenalty = bnplItems.some((item) => item.payload.contractDebts.penaltyAmount > 0);
    const params: Record<string, string> = {
      referrer: bnplHasPenalty ? 'widgetfine-1Pay,4Pay' : 'widget-1Pay,4Pay',
      rfr: 'hub',
      [CallbackInstallmentsOverviewKey]: encodeURIComponent('/'),
    };
    if (referrer === 'bottom-sheet') {
      params['referrer'] = bnplHasPenalty ? 'Bottom-sheet-fine-1pay,4pay' : 'Bottom-sheet-widget-1pay,4pay';
    }
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['installment-widget'],
      data: {
        target: 'installment-widget: multiple',
      },
      meta: JSON.stringify(params),
    });
    this.actionHandlerService.handle({
      type: ActionType.PAY_INSTALLMENT,
      payload: {
        params: { ...params, closeServiceUrl: window.location.pathname },
        serviceType: SERVICE_TYPE.BNPL,
      },
    });
  }

  private handleMultipleCreditPayments(referrer = 'widget'): void {
    const creditItems = this.displayData()?.items.filter((item) => item.payload.serviceType === SERVICE_TYPE.CREDIT) || [];
    const creditHasPenalty = creditItems.some((item) => item.payload.contractDebts.penaltyAmount > 0);
    const params: Record<string, string> = {
      referrer: creditHasPenalty ? 'widgetfine-Credit' : 'widget-Credit',
      rfr: 'hub',
      [CallbackInstallmentsOverviewKey]: encodeURIComponent('/'),
    };
    if (referrer === 'bottom-sheet') {
      params['referrer'] = creditHasPenalty ? 'Bottom-sheet-fine-credit' : 'Bottom-sheet-widget-credit';
    }
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['installment-widget'],
      data: {
        target: 'installment-widget: multiple',
      },
      meta: JSON.stringify(params),
    });
    this.actionHandlerService.handle({
      type: ActionType.PAY_INSTALLMENT,
      payload: {
        params: { ...params, closeServiceUrl: window.location.pathname },
        serviceType: SERVICE_TYPE.CREDIT,
      },
    });
  }

  private showInstallmentDetail(): void {
    // Track bottom sheet view event
    if (this.appNameService.isPillar()) {
      this.eventTrackerService.sendEvent({
        eventName: 'InstallmentBottomSheetView',
        eventData: {},
      });
    }

    this.bottomSheetService.openBottomSheet(InstallmentDetailDialogComponent, { data: this.displayData() }, { noPadding: true });
    const payMethodPickerSub = this.bottomSheetService.onClose.subscribe(() => {
      payMethodPickerSub.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (result) {
        // Track bottom sheet click event
        if (this.appNameService.isPillar()) {
          this.eventTrackerService.sendEvent({
            eventName: 'Pillar_InstallmentBottomSheetClick',
            eventData: {},
          });
        }

        if (this.displayData()!.bnplCount > 1 && result.payload.serviceType === SERVICE_TYPE.BNPL) {
          this.handleMultipleBnplPayments('bottom-sheet');
        } else if (this.displayData()!.creditCount > 1 && result.payload.serviceType === SERVICE_TYPE.CREDIT) {
          this.handleMultipleCreditPayments('bottom-sheet');
        } else {
          this.handleSinglePayment(result, 'bottom-sheet');
        }
      }
    });
  }

  public refresh(): void {
    this.loadPaymentData(true);
  }
}
