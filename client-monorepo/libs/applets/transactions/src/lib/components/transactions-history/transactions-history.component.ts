import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  allTransactionsGroup,
  GroupedTransactionsComponent,
  pillarTransactionsGroup,
  TransactionCard,
  TransactionCardService,
  TransactionInterface,
  TransactionsApiService,
  TransactionSearchPayloadInterface,
  TransactionSearchPayloadRestrictionItemInterface,
  TransactionsHistorySearchComponent,
  TransactionsSearchService,
  TransactionType,
  TransactionTypeGroupInterface,
  TransactionTypeGroupsNamesEnum,
} from '@client-monorepo/payment/transactions';
import { APP_NAME_ENUM, AppNameService, rangeCreator, SetOfObjects } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { FilterComponent } from '@client-monorepo/common/ui-components';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'transactions-applet-transactions-history',
  standalone: true,
  imports: [
    CommonModule,
    NgxSkeletonLoadingComponent,
    GroupedTransactionsComponent,
    FilterComponent,
    UiFormFieldBuilderModule,
    NgxChipComponent,
  ],
  templateUrl: './transactions-history.component.html',
  styleUrl: './transactions-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsHistoryComponent implements OnInit {
  isLoading = signal<boolean>(false);
  transactions = signal<TransactionInterface[]>([]);
  pendingTransactions = signal<TransactionCard[]>([]);
  dirty = signal(1);
  restrictions = computed(() => {
    if (this.dirty()) {
      return this.transactionSearchService.restrictions();
    } else return undefined;
  });
  transactionsApiService = inject(TransactionsApiService);
  bottomSheetService = inject(NgxBottomSheetService);
  transactionSearchService = inject(TransactionsSearchService);
  transactionCardService = inject(TransactionCardService);
  private appNameService = inject(AppNameService);

  appName: APP_NAME_ENUM = this.appNameService.getAppName();

  transactionGroups = computed(() => {
    return this.appNameService.isPillar() ? pillarTransactionsGroup : allTransactionsGroup;
  });

  currentPage = 0;
  pageSize = 15;
  haveNextPage = true;
  TransactionTypeGroupsNamesEnum = TransactionTypeGroupsNamesEnum;
  rangeCreator = rangeCreator;
  classesForDeactiveItem = 'text-onback-high border-color-light';
  classesForActiveItem = 'text-onback-brand border-color-brand surface-brand-tint';
  dateQuickFilterClasses = computed(() => {
    if (this.dirty() && this.restrictions() && this.restrictions()!.has({ field: 'exerciseDate' })) {
      return this.classesForActiveItem;
    } else {
      return this.classesForDeactiveItem;
    }
  });
  chargeQuickFilterClasses = signal(this.classesForDeactiveItem);
  c2cQuickFilterClasses = signal(this.classesForDeactiveItem);
  walletQuickFilterClasses = signal(this.classesForDeactiveItem);
  loanQuickFilterClasses = signal(this.classesForDeactiveItem);
  isFilterChipPressed = signal<boolean>(false);
  initialLoad = signal<boolean>(false);
  route = inject(ActivatedRoute);

  constructor() {
    toObservable(this.restrictions).subscribe({
      next: () => {
        this.checkForActiveClasses();
      },
      error: (error) => {
        console.error('[TransactionsHistory] Error in restrictions observable:', error);
      },
    });
  }

  ngOnInit() {
    if (this.route.snapshot.queryParams['type']) {
      const types: string[] = this.route.snapshot.queryParams['type'].split(',');
      const restrictions = [
        {
          field: 'type',
          type: 'or',
          restrictions: types.map((type: string) => {
            return {
              field: 'type',
              type: 'simple',
              operation: 'eq',
              value: +type,
            };
          }),
        },
      ];
      const tempData = new SetOfObjects<TransactionSearchPayloadRestrictionItemInterface>((restriction) => restriction?.field ?? '');
      tempData.set(restrictions);
      this.transactionSearchService.restrictions.set(tempData);
    }
    this.initPage();
  }

  private initPage(): void {
    this.loadTransactions();
    this.getPendingTransactions();
  }

  getPendingTransactions(): void {
    this.transactionsApiService.getPendingTransactions().subscribe({
      next: (res) => {
        this.pendingTransactions.set(this.transactionCardService.mapPendingTransactionsToTransactionCards(res.drafts));
      },
      error: (error) => {
        console.error('[TransactionsHistory] Error loading pending transactions:', error);
        // Set empty array on error to avoid breaking UI
        this.pendingTransactions.set([]);
      },
    });
  }

  handleEnd(): void {
    if (this.haveNextPage && this.initialLoad()) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  private loadTransactions(payload: TransactionSearchPayloadInterface = {}): void {
    // Get current restrictions or create empty array
    let restrictions = this.restrictions()?.values() || [];

    // If in Pillar environment and no type restrictions exist, add default Pillar type restrictions
    if (this.appNameService.isPillar() && !restrictions.some((r) => r.field === 'type')) {
      const pillarTypes = this.transactionGroups().flatMap((group) => group.types);
      const pillarTypeRestriction = {
        field: 'type',
        type: 'or',
        restrictions: pillarTypes.map((type) => ({
          field: 'type',
          type: 'simple',
          operation: 'eq',
          value: type,
        })),
      };
      restrictions = [...restrictions, pillarTypeRestriction];
    }

    payload = {
      ...payload,
      size: this.pageSize,
      page: this.currentPage,
      restrictions,
      orders: [
        {
          field: 'exerciseDate',
          order: 'desc',
        },
      ],
    };
    this.isLoading.set(true);
    this.transactionsApiService.getTransactionsList(payload).subscribe({
      next: (result) => {
        this.createTransactionsList(result.activities);
        if (result.activities.length < this.pageSize) {
          this.haveNextPage = false;
        }
      },
      error: (error) => {
        console.error('[TransactionsHistory] Error loading transactions:', error);
        this.isLoading.set(false);
        this.haveNextPage = false;
      },
      complete: () => {
        this.isLoading.set(false);
        this.initialLoad.set(true);
      },
    });
  }

  private createTransactionsList(transactions: Array<TransactionInterface>): void {
    this.transactions.set(this.transactions().concat(transactions));
  }

  handleFilterToggle(): void {
    this.bottomSheetService.openBottomSheet(TransactionsHistorySearchComponent, {
      restrictions: this.restrictions()?.values(),
    });
    const bottomSheetSubscription = this.bottomSheetService.onClose.subscribe({
      next: () => {
        const data = this.bottomSheetService.outputData();
        if (data !== null) {
          const tempData = new SetOfObjects<TransactionSearchPayloadRestrictionItemInterface>((restriction) => restriction?.field ?? '');
          tempData.set(data);
          this.transactionSearchService.restrictions.set(tempData);
          this.transactions.set([]);
          this.currentPage = 0;
          this.haveNextPage = true;
          this.loadTransactions();
          this.checkForActiveClasses();
          this.toggleDirty();
        }
        bottomSheetSubscription.unsubscribe();
      },
      error: (error) => {
        console.error('[TransactionsHistory] Error in bottom sheet:', error);
        bottomSheetSubscription.unsubscribe();
      },
    });
  }

  findGroupByName(groupName: string): TransactionTypeGroupInterface | undefined {
    // Use the computed transactionGroups instead of allTransactionsGroup
    return this.transactionGroups().find((group) => {
      return group.name === groupName;
    });
  }

  isQuickFilterActive(groupName: string): boolean {
    const group = this.findGroupByName(groupName);
    if (group) {
      const selectedTypes =
        this.restrictions()
          ?.get({ field: 'type' })
          ?.restrictions?.map((restriction) => restriction.value) ?? [];
      return group.types.every((typ) => selectedTypes.includes(typ));
    }
    return false;
  }

  toggleQuickFilter(groupName: string): void {
    const group = this.findGroupByName(groupName);
    const types = this.restrictions()?.get({ field: 'type' }) ?? {
      field: 'type',
      type: 'or',
      restrictions: [],
    };
    if (this.isQuickFilterActive(groupName)) {
      types.restrictions = types?.restrictions?.filter((restriction) => {
        return !group?.types.includes(restriction.value as TransactionType);
      });
    } else {
      group?.types.forEach((typ) => {
        types.restrictions?.push({
          field: 'type',
          type: 'simple',
          operation: 'eq',
          value: typ,
        });
      });
    }
    this.transactionSearchService.restrictions().delete({ field: 'type' });
    if (types.restrictions?.length) {
      this.transactionSearchService.restrictions().add(types);
    }
    this.transactions.set([]);
    this.currentPage = 0;
    this.haveNextPage = true;
    this.loadTransactions();
    this.checkForActiveClasses();
    this.toggleDirty();
  }

  private checkForActiveClasses(): void {
    if (this.isQuickFilterActive(TransactionTypeGroupsNamesEnum.CHARGE)) {
      this.chargeQuickFilterClasses.set(this.classesForActiveItem);
    } else {
      this.chargeQuickFilterClasses.set(this.classesForDeactiveItem);
    }
    if (this.isQuickFilterActive(TransactionTypeGroupsNamesEnum.C2C)) {
      this.c2cQuickFilterClasses.set(this.classesForActiveItem);
    } else {
      this.c2cQuickFilterClasses.set(this.classesForDeactiveItem);
    }
    if (this.isQuickFilterActive(TransactionTypeGroupsNamesEnum.WALLET)) {
      this.walletQuickFilterClasses.set(this.classesForActiveItem);
    } else {
      this.walletQuickFilterClasses.set(this.classesForDeactiveItem);
    }
    if (this.isQuickFilterActive(TransactionTypeGroupsNamesEnum.LOAN)) {
      this.loanQuickFilterClasses.set(this.classesForActiveItem);
    } else {
      this.loanQuickFilterClasses.set(this.classesForDeactiveItem);
    }
  }

  toggleDirty() {
    this.dirty.update((value) => {
      return value + 1;
    });
  }

  protected readonly APP_NAME_ENUM = APP_NAME_ENUM;
}
