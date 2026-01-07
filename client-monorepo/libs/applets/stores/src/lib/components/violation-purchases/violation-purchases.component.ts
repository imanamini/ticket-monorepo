import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ItemOverview,
  ItemOverviewComponent,
  NoItemComponent,
  TitleSummaryComponent,
} from '@client-monorepo/common/ui-components';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { getFullJalaliDate, rangeCreator } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PaymentChannels, PurchaseApiService, PurchaseModel } from '@client-monorepo/payment/purchase';
import { ViolationService } from '../../data-access/services/violation.service';
import { Store, StoreType } from '@client-monorepo/stores';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PurchaseTypeToStoreTypeMapper, ViolationPaymentMethodsTitleMapper } from '../../data-access/constants/violation.const';
import { ViolationBottomSheetItemModel } from '../../data-access/models/violation.model';
import { ServiceImagesType } from '@client-monorepo/common/service-data';

@Component({
  selector: 'stores-applet-violation-purchases',
  standalone: true,
  imports: [
    CommonModule,
    TitleSummaryComponent,
    ItemOverviewComponent,
    NgxIcon,
    PipesModule,
    NoItemComponent,
    NgxButtonComponent,
    NgxSearchBoxComponent,
  ],
  templateUrl: './violation-purchases.component.html',
  styleUrl: './violation-purchases.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationPurchasesComponent implements OnInit {
  // Injections
  purchaseApi = inject(PurchaseApiService);
  violationService = inject(ViolationService);
  bottomSheetService = inject(NgxBottomSheetService);
  destroyRef = inject(DestroyRef);

  // Inputs
  mode = computed<'ALL' | 'SINGLE_STORE'>(() =>
    this.violationService.purchaseStatus() === 'PURCHASED' && this.paramsTrackingCode() ? 'SINGLE_STORE' : 'ALL',
  );

  // Variables
  protected readonly rangeCreator = rangeCreator;
  preSelectedStore = signal<Store | undefined>(undefined);
  searchText = signal<string>('');
  paramsTrackingCode = signal<string | undefined>(undefined);
  purchases = signal<PurchaseModel[]>([]);
  purchasesToShow = signal<ItemOverview[]>([]);
  selectedPurchase = signal<ItemOverview | undefined>(undefined);
  loadingPurchases = signal<boolean>(true);
  searched = signal(false);

  constructor() {
    effect(
      () => {
        if (this.purchases().length) {
          this.purchasesToShow.set(this.generatePurchasesToShow());
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.getParams();
    this.getPurchases();
  }

  getParams(): void {
    if (this.violationService.params()['trackingCode']) {
      this.paramsTrackingCode.set(this.violationService.params()['trackingCode']);
    }
  }

  doSearch(phrase: string) {
    const filteredClone =
      phrase.length > 1 ? this.purchases().filter((purchase) => purchase.store?.title.includes(phrase)) : this.purchases();
    this.searched.set(true);
    this.purchasesToShow.set(this.convertPurchaseToItem(filteredClone));
  }

  generatePurchasesToShow() {
    if (!this.purchases().length) return [];
    const purchases =
      this.mode() === 'SINGLE_STORE'
        ? this.purchases().filter((purchase) => purchase.store?.trackingCode === this.paramsTrackingCode())
        : this.purchases();
    return this.convertPurchaseToItem(purchases);
  }

  getPurchases(): void {
    this.loadingPurchases.set(true);
    this.purchaseApi.getPurchases().subscribe({
      next: (res) => {
        this.purchases.set(res.purchaseList?.sort((a, b) => b.activityExerciseDate - a.activityExerciseDate) ?? []);
        this.loadingPurchases.set(false);
      },
    });
  }

  handleTransactionSelect(item: ItemOverview): void {
    this.selectedPurchase.set(item);
  }

  convertPurchaseToItem(purchases: PurchaseModel[]): ItemOverview[] {
    if (!purchases?.length) return [];
    return purchases.map((purchase, index) => {
      return {
        id: String(purchase.activityExerciseDate),
        image: { type: ServiceImagesType.IMAGE_ID, name: purchase.store?.logoImageId ?? '' },
        title: purchase.store?.title ?? 'تراکنش',
        subTitleNormal: getFullJalaliDate(purchase.activityExerciseDate),
        subTitleBold: String(purchase.activityAmount),
        divider: index !== purchases.length - 1,
      } as ItemOverview;
    });
  }

  handleSubmitClick(): void {
    if (!this.selectedPurchase()) return;
    this.violationService.purchase.set(
      this.purchases().filter((purchase) => String(purchase.activityExerciseDate) === this.selectedPurchase()?.id)[0],
    );
    if (
      this.violationService.purchase()?.activityPaymentChannel &&
      this.violationService.purchase()?.activityPaymentChannel !== PaymentChannels.QR
    ) {
      this.violationService.paymentMethod.set(PurchaseTypeToStoreTypeMapper[this.violationService.purchaseType()!]);
      this.violationService.nextStep();
    } else {
      this.handleRequestInCaseOfQR();
    }
  }

  handleRequestInCaseOfQR(): void {
    const storeTypes = this.violationService.purchase()?.store?.types;
    if (storeTypes?.includes(StoreType.ONSITE) && storeTypes?.includes(StoreType.SOCIAL_INSTAGRAM)) {
      const items: ViolationBottomSheetItemModel[] = [
        {
          id: '0',
          storeType: StoreType.ONSITE,
          title: ViolationPaymentMethodsTitleMapper[StoreType.ONSITE],
        },
        {
          id: '2',
          storeType: StoreType.SOCIAL_INSTAGRAM,
          title: ViolationPaymentMethodsTitleMapper[StoreType.SOCIAL_INSTAGRAM],
        },
      ];
      this.violationService.showBottomSheet(items, 'روش خرید');
    } else {
      const storeTypes = this.violationService.purchase()?.store?.types;
      if (storeTypes?.includes(StoreType.ONSITE)) {
        this.violationService.paymentMethod.set(StoreType.ONSITE);
        this.violationService.nextStep();
      } else {
        this.violationService.paymentMethod.set(StoreType.SOCIAL_INSTAGRAM);
        this.violationService.nextStep();
      }
    }
  }
}
