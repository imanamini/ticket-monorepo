import { Component, computed, effect, inject, input, OnInit, output, signal, untracked } from '@angular/core';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { NgxTabComponent, NgxTabsComponent } from '@digipay/ngx-tabs';
import { PipesModule, SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { VoucherComponent } from './voucher/voucher.component';
import { NgClass } from '@angular/common';
import { BnplPaymentMethodCardComponent } from './bnpl-payment-method-card/bnpl-payment-method-card.component';
import { PriceOptionModel } from '../../data-access/models/application-form/price-option.model';
import {
  PURCHASE_TICKET_TYPE_TRANSLATOR,
  PurchaseTicketTypeEnum
} from '../../data-access/enums/purchase-ticket-type.enum';
import { PersonalInventoryModel } from '../../features/third-party/data-access/models/personal-inventory.model';
import { TitleValueModel } from '../../../../data-access/models/title-value.model';
import { QueryParamService } from '../../../../data-access/services/query-param.service';
import { ThirdPartyKeysEnum } from '../../features/third-party/data-access/enums/third-party-keys.enum';
import { BnplExtraDetailModel } from '../../data-access/models/third-party/order/bnpl-extra-detail.model';
import { WalletExtraDetailModel } from '../../data-access/models/third-party/order/wallet-extra-detail.model';
import { IconEnum } from '../../../../data-access/enums/icon.enum';
import { ExtendOrderReasonEnum } from '../../data-access/enums/extended-order-reason.enum';
import { BaseComponent } from '../../../../components/base/base.component';

interface ExtendedSegmentItemsModel extends SegmentItemsModel {
  badgeCount?: number;
}

@Component({
  selector: 'payment-methods',
  standalone: true,
  imports: [
    NgxIcon,
    NgxDividerComponent,
    VoucherComponent,
    NgxTabsComponent,
    NgxTabComponent,
    PipesModule,
    NgClass,
    BnplPaymentMethodCardComponent,
  ],
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.scss',
  providers: [SeparateThousandsPipe],
})
export class PaymentMethodsComponent extends BaseComponent implements OnInit {
  unit = 'تومان';
  methods = input.required<PriceOptionModel[]>();
  productType = input.required<'car' | 'motor'>();
  selectedMethodChange = output<PurchaseTicketTypeEnum>();
  reloadOrderEmitter = output<boolean>();
  isVerifyingBnpl = signal<boolean>(false);
  selectedMethod = signal<PriceOptionModel>(null);
  selectedSegment = computed<SegmentItemsModel>(() => {
    if (!this.selectedMethod()) {
      return null;
    }

    return {
      id: this.selectedMethod().ticketType,
      text: PURCHASE_TICKET_TYPE_TRANSLATOR[this.selectedMethod().ticketType],
      value: this.selectedMethod().ticketType,
      icon: 'check-circle',
      iconType: 'bold',
    };
  });
  segmentControls = computed<ExtendedSegmentItemsModel[]>(() => {
    return this.methods()
      .filter((method) => !method.isBanned)
      .map((method) => {
        const campaignItem = method.extendedPricing.find(
          (z) => z.extendedOrderReason === ExtendOrderReasonEnum.CAMPAIGN_DISCOUNT && z.amount > 0,
        );
        return {
          id: method.ticketType,
          text: PURCHASE_TICKET_TYPE_TRANSLATOR[method.ticketType],
          value: method.ticketType,
          icon: this.selectedMethod()?.ticketType === method.ticketType ? 'check-circle' : undefined,
          iconType: 'bold',
          badgeCount: campaignItem ? (campaignItem.campaignDiscount ?? 9) : undefined,
        };
      });
  });
  inventory = computed<PersonalInventoryModel>(() => {
    return this.computeInventory();
  });
  paymentDetails = computed<TitleValueModel[]>(() => {
    return this.computePaymentDetails();
  });

  protected readonly PurchaseTicketTypeEnum = PurchaseTicketTypeEnum;
  protected readonly IconEnum = IconEnum;

  public thousandsPipe = inject(SeparateThousandsPipe);
  private queryParamsService = inject(QueryParamService);

  constructor() {
    super();
    effect(
      () => {
        this.setSelectedMethod();
        untracked(() => this.selectedMethod());
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.preSelectPaymentMethod();
  }

  preSelectPaymentMethod(): void {
    super.addSubscription(
      this.queryParamsService.getQueryParams([ThirdPartyKeysEnum.PaymentMethod], false).subscribe({
        next: (params) => {
          const preSelectMethod = params[ThirdPartyKeysEnum.PaymentMethod];
          if (!preSelectMethod) {
            return;
          }
          if (preSelectMethod === PurchaseTicketTypeEnum[this.selectedMethod()?.ticketType]) {
            return;
          }
          this.selectedMethod.set(this.methods().find((item) => item.ticketType === PurchaseTicketTypeEnum[preSelectMethod]));
          this.selectedMethodChange.emit(PurchaseTicketTypeEnum[preSelectMethod]);
        },
      }),
    );
  }

  handleMethodChanged(state: any, segment: SegmentItemsModel): void {
    if (this.isVerifyingBnpl()) {
      return;
    }
    if (state === 'selected') {
      this.selectedMethod.set(this.methods().find((item) => item.ticketType === segment.value));
      this.selectedMethodChange.emit(segment.value as PurchaseTicketTypeEnum);
    }
  }

  setSelectedMethod(): void {
    if (this.isVerifyingBnpl()) {
      return;
    }
    if (this.selectedMethod()) {
      this.selectedMethod.set(this.methods().find((method) => method.ticketType === this.selectedMethod().ticketType));
      return;
    }
    const firstMethodWithDiscount = this.getFirstMethodWithDiscount();
    if (firstMethodWithDiscount) {
      this.selectedMethod.set(firstMethodWithDiscount);
      this.selectedMethodChange.emit(firstMethodWithDiscount.ticketType);
      return;
    }
    const firstAvailableMethod = this.getFirstAvailableMethod();
    this.selectedMethod.set(firstAvailableMethod);
    this.selectedMethodChange.emit(firstAvailableMethod.ticketType);
  }

  getFirstAvailableMethod(): PriceOptionModel {
    return this.methods().find((method) => !method.isBanned);
  }

  getFirstMethodWithDiscount(): PriceOptionModel {
    return this.methods()?.find((method) => !method.isBanned && method.extraDetails.pricingRuleDiscountPercent > 0);
  }

  computeInventory(): PersonalInventoryModel {
    if (this.selectedMethod()?.ticketType === PurchaseTicketTypeEnum.IPG) {
      return null;
    }
    switch (this.selectedMethod()?.ticketType) {
      case PurchaseTicketTypeEnum.BNPL:
        return {
          title: 'اعتبار',
          amount: this.thousandsPipe.transform((this.selectedMethod()?.extraDetails as BnplExtraDetailModel)?.creditAmount / 10),
          iconName: 'bnpl',
          iconClass: 'bnpl-icon',
          show: !(this.selectedMethod()?.extraDetails as BnplExtraDetailModel).showVerificationAllocationButton,
        };

      case PurchaseTicketTypeEnum.WALLET:
        return {
          title: 'کیف‌پول',
          amount: this.thousandsPipe.transform((this.selectedMethod()?.extraDetails as WalletExtraDetailModel)?.balance / 10),
          iconName: 'wallet',
          iconClass: 'wallet-icon',
          show: true,
        };

      default:
        return null;
    }
  }

  computePaymentDetails(): TitleValueModel[] {
    if (!this.selectedMethod()) {
      return null;
    }
    const details: TitleValueModel[] = [];
    const titleSuffixMapper = {
      DiscountCode: this.selectedMethod().discount.code,
    };
    const textColorMapper = {
      CampaignDiscount: 'text-onback-error',
    };
    const titleSuffixColorMapper = {
      DiscountCode: 'text-onback-success',
    };
    details.push({
      title: 'مبلغ حق بیمه',
      value: this.thousandsPipe.transform(this.selectedMethod().rawAmount / 10),
      valuePrefix: this.unit,
    });
    this.selectedMethod()?.extendedPricing.forEach((extraDetail) => {
      if (
        (extraDetail.extendedOrderReason === ExtendOrderReasonEnum.DISCOUNT_CODE ||
          extraDetail.extendedOrderReason === ExtendOrderReasonEnum.CAMPAIGN_DISCOUNT) &&
        extraDetail.amount === 0
      ) {
        return;
      }
      details.push({
        title: extraDetail.name,
        titleColor: textColorMapper[extraDetail.extendedOrderReason] ?? 'text-onback-low',
        titleSuffix: titleSuffixMapper[extraDetail.extendedOrderReason] ?? null,
        titleSuffixColor: titleSuffixColorMapper[extraDetail.extendedOrderReason] ?? null,
        value: this.thousandsPipe.transform(extraDetail.amount / 10),
        valueColor: textColorMapper[extraDetail.extendedOrderReason] ?? 'text-onback-high',
        valuePrefix: this.unit,
      });
    });
    return details;
  }

  handleVoucherChanged(event: boolean): void {
    if (!event) {
      return;
    }
    this.reloadOrderEmitter.emit(true);
  }

  handleIsVerifying(isVerifying: boolean): void {
    this.isVerifyingBnpl.set(isVerifying);
  }

  handleVerifiedAllocation(userHasVerified: boolean): void {
    if (userHasVerified) {
      this.reloadOrderEmitter.emit(true);
    }
  }

  isBnplExtraDetail(detail: BnplExtraDetailModel | WalletExtraDetailModel | null): detail is BnplExtraDetailModel {
    return !!detail && detail !== null && 'showVerificationAllocationButton' in detail;
  }

  getBnplExtraDetails(): BnplExtraDetailModel | null {
    const details = this.selectedMethod()?.extraDetails;
    return this.isBnplExtraDetail(details) ? details : null;
  }
}
