import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditStoreBottomSheetComponent } from '../../../pre-registration/components/credit-store-bottom-sheet/credit-store-bottom-sheet.component';
import { StoresDataService } from '../../../pre-registration/components/credit-store-list/stores-data.service';
import { STORE_PROVIDERS } from '../../../data-access/models/credit/store/store-providers';
import { CreditStoreListComponent } from '../../../pre-registration/components/credit-store-list/credit-store-list.component';
import { CreditScoringSmcApiService } from '../../../data-access/services/credit-scoring-smc-api.service';
import { CreditSmcScoreDetailsResponse } from '../../../data-access/models/credit/smc-score/credit-smc-score-details.response';

import { MessageService } from '../../../data-access/services/message.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxCard } from '@digipay/ngx-card';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { SERVICE_TYPE } from '../../../data-access/models/credit/service-type/service-type.model';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { DecimalPipe } from '@angular/common';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../../credit-environment.interface';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'app-credit-scoring-smc-step-success-page',
  standalone: true,
  imports: [
    CreditStoreListComponent,
    NgxButtonComponent,
    ApiImageModule,
    NgxCard,
    DecimalPipe,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    NgxBadgeModule,
  ],
  templateUrl: './credit-scoring-smc-step-success-page.component.html',
  styleUrl: './credit-scoring-smc-step-success-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringSmcStepSuccessPageComponent implements OnInit {
  creditId = input.required<string>();
  showLoading = signal<boolean>(true);
  back = output<void>();
  close = output<void>();
  finish = output<void>();
  creditAmountLoaded = output<number>();
  storesList = signal<any[]>([]);
  card = signal<CreditSmcScoreDetailsResponse | null>(null);
  page = 0;
  pageSize = 3;
  private destroyed = false;
  private destroyRef = inject(DestroyRef);

  timer = signal<TimerCountDownModel>({
    timerType: 'mm:ss',
    timeInSeconds: 10,
  });

  title = computed(() => {
    if (this.card()?.installmentCount === 1) {
      return 'اعتبار ماهانه';
    } else if (this.card()?.installmentCount === 4) {
      return 'اعتبار ۴ قسطه';
    }
    return 'اعتبار اقساطی';
  });

  purchaseContent = computed(() => {
    const content = [];
    if (this.card()?.installmentCount === 1) {
      content.push({
        title: 'زمان بازپرداخت',
        subtitle: 'یکم تا پنجم ماه',
        icon: '',
      });
    } else {
      content.push(
        {
          title: 'قسط اول (پیش‌پرداخت)',
          subtitle: 'زمان خرید',
          icon: 'icon-first-pay',
        },
        {
          title: 'قسط دوم',
          subtitle: 'یکم ماه اول',
          icon: 'icon-second-pay',
        },
        {
          title: 'قسط سوم',
          subtitle: 'یکم ماه دوم',
          icon: 'icon-third-pay',
        },
        {
          title: 'قسط چهارم',
          subtitle: 'یکم ماه سوم',
          icon: 'icon-fourth-pay',
        },
      );
    }
    return content;
  });

  storesDataService = inject(StoresDataService);
  bottomSheetService = inject(NgxBottomSheetService);
  creditScoringSmcApiService = inject(CreditScoringSmcApiService);
  messageService = inject(MessageService);
  public creditEnvironment = inject<CreditEnvironmentInterface>(CREDIT_ENVIRONMENT);
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';
  protected readonly String = String;

  fundProviderIconId = computed(() => {
    const iconId = this.card()?.fundProvider?.icon;
    if (!iconId) return '';
    return this.isPillar ? `${iconId}` : iconId;
  });

  ngOnInit() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });

    this.getDetailsCard();
    this.showStores();
  }

  getDetailsCard(): void {
    this.creditScoringSmcApiService.getSmcDetails(this.creditId()).subscribe({
      next: (response) => {
        // Defer signal writes to escape reactive context
        setTimeout(() => {
          if (!this.destroyed) {
            this.showLoading.set(false);
            this.card.set(response);
            if (response?.creditAmount != null) {
              this.creditAmountLoaded.emit(response.creditAmount);
            }
          }
        }, 0);
      },
      error: (error) => {
        // Defer signal writes to escape reactive context
        setTimeout(() => {
          if (!this.destroyed) {
            this.showLoading.set(false);
            this.messageService.showErrorOfErrorResponse(error);
            this.back.emit();
          }
        }, 0);
      },
    });
  }

  setFilterStore() {
    this.storesDataService.setSelectedProvider(STORE_PROVIDERS.BNPL);
  }

  async showStores() {
    this.setFilterStore();
    const stores = await this.storesDataService.getStoresList(this.page, this.pageSize);
    this.storesList.set(stores);
  }

  openStores() {
    this.bottomSheetService.openBottomSheet(
      CreditStoreBottomSheetComponent,
      {
        serviceType: SERVICE_TYPE.BNPL,
      },
      {
        noPadding: true,
      },
    );
  }
}
