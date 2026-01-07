import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import {
  GetBankAccountVerificationStatusResponse,
  translateErrorCode,
} from '../../data-access/models/credit/activation/get-bank-account-verification-status.response';
import { BankAccountVerificationStatus } from '../../data-access/models/credit/activation/bank-account-verification-status';
import { MessageService } from '../../data-access/services/message.service';
import { isDesktop } from '../../data-access/utils/device';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { FUND_PROVIDER_CODE, FUND_PROVIDER_TRANSLATOR } from '../../data-access/models/credit/fund-provider/fund-provider-code';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { NgTemplateOutlet } from '@angular/common';
import { Buttons, IconStateType, NgxStatusResultModule, StateType } from '@digipay/ngx-status-result';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditUserService } from '../../data-access/services/credit-user.service';

@Component({
  selector: 'app-credit-bank-account-verification-step',
  templateUrl: './credit-bank-account-verification-step.component.html',
  styleUrls: ['./credit-bank-account-verification-step.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    NgxStatusResultModule,
    NgxWaitingStepperComponent,
    NgTemplateOutlet,
    CreditPageLoadingComponent,
    NgxCalloutComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditBankAccountVerificationStepComponent implements OnInit, AfterViewInit, OnDestroy {
  gettingData = signal<boolean | null>(null);
  fundProviderCode!: FUND_PROVIDER_CODE;
  creditId!: string;
  statusData = signal<GetBankAccountVerificationStatusResponse | null>(null);
  statusEnum = BankAccountVerificationStatus;
  pageTitle = signal<string>('بررسی افتتاح حساب');
  translateErrorCode = translateErrorCode;
  private pollingTimeoutId: any = null;
  errors = signal<
    {
      code: number;
      text: string;
    }[]
  >([]);
  isDeviceDesktop = signal<boolean>(false);
  actionImage = computed(() => (this.isDeviceDesktop() ? '' : 'headphone'));
  iconState = computed<IconStateType | null>(() => {
    const status = this.statusData()?.status;
    if (status === this.statusEnum.FAILED || status === this.statusEnum.SERVICE_UNAVAILABLE) {
      return 'warning';
    }
    if (status === this.statusEnum.REJECTED) {
      return 'error';
    }
    if (status === this.statusEnum.SERVICE_ERROR) {
      return 'retry';
    }
    return null;
  });
  typeState = computed<StateType>(() => {
    return this.statusData()?.status === this.statusEnum.SERVICE_ERROR ? 'Retry' : 'Status';
  });
  retryTypeState = computed<boolean>(() => this.statusData()?.status === this.statusEnum.SERVICE_ERROR);

  buttons: { [key in BankAccountVerificationStatus]?: Buttons[] } = {
    [BankAccountVerificationStatus.SUCCESS]: [
      {
        id: 'success-button',
        style: 'fill',
        mode: 'form',
        label: 'ادامه فرآیند',
        fullWidth: true,
        timer: { timerType: 'mm:ss', timeInSeconds: 10 },
      },
    ],
    [BankAccountVerificationStatus.SERVICE_ERROR]: [],
    [BankAccountVerificationStatus.FAILED]: [],
    [BankAccountVerificationStatus.REJECTED]: [
      {
        id: 'back-button',
        style: 'fill',
        mode: 'form',
        label: 'متوجه شدم',
        fullWidth: true,
      },
    ],
    [BankAccountVerificationStatus.SERVICE_UNAVAILABLE]: [
      {
        id: 'unavailable-button',
        style: 'fill',
        mode: 'form',
        label: 'متوجه شدم',
        fullWidth: true,
      },
    ],
  };
  timer = signal<TimerCountDownModel>({
    timeInSeconds: this.statusData()?.checkCountDown,
    timerType: 'custom',
  });
  protected readonly isDesktop = isDesktop;

  errorsMap = computed(() => {
    return this.errors().map((error) => {
      if (error.code === 10122 || error.code === 10128) {
        return `${error.text} [کد شهاب چیست؟]`;
      }
      return error.text;
    });
  });

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  creditUrlService = inject(CreditUrlService);
  creditApiService = inject(CreditApiService);
  messageService = inject(MessageService);
  elementRef = inject(ElementRef);
  userService = inject(CreditUserService);

  constructor() {
    effect(
      () => {
        if (this.statusData()?.checkCountDown) {
          this.timer.set({
            timeInSeconds: this.statusData()?.checkCountDown,
            timerType: 'custom',
          });
        }
      },
      {
        allowSignalWrites: true,
      },
    );
  }

  ngOnInit(): void {
    this.isDeviceDesktop.set(isDesktop());
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.getData();
  }

  // Temporarily disabled, it might be used for other providers in future
  async checkServiceUnavailableTime() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const start = 5 * 60; // 05:00
    const end = 23 * 60 + 30; // 23:30
    if (this.fundProviderCode !== FUND_PROVIDER_CODE.SADERAT || (minutes >= start && minutes <= end)) {
      this.getData();
    } else {
      this.statusData.update((data) => ({
        ...data!,
        pageTitle: 'بررسی حساب بانکی',
        title: 'محدودیت در دسترسی به سامانه بررسی حساب بانکی',
        message: 'ارائه خدمات سامانه بررسی حساب بانکی تنها به‌صورت روزانه و در بازه زمانی ساعت 5:00 الی 23:30 امکان‌پذیر خواهد بود.',
        status: this.statusEnum.SERVICE_UNAVAILABLE,
      }));
      this.pageTitle.set('بررسی حساب بانکی');
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const templateElement = this.elementRef?.nativeElement.querySelector('ngx-callout');
      if (templateElement) {
        templateElement.addEventListener('click', (event: any) => {
          const clickedText = (event.target as HTMLElement).textContent || '';
          if (clickedText.includes('کد شهاب چیست؟')) {
            this.goToShahab();
          }
        });
      }
    }, 1000);
  }

  getData(): void {
    this.gettingData.set(true);
    this.creditApiService.getBankAccountVerificationStatus(this.creditId, this.fundProviderCode).subscribe(
      (response) => {
        this.statusData.set(response);
        if (this.statusData()?.errorCodes) {
          this.errors.set(this.translateErrorCode(this.statusData()?.errorCodes!));
        }
        if (this.statusData()?.retryable) {
          if (this.statusData()?.status === this.statusEnum.SERVICE_ERROR) {
            const find = this.buttons[this.statusEnum.SERVICE_ERROR]?.find((item) => item.id === 'retry-button');
            if (!find) {
              this.buttons[this.statusEnum.SERVICE_ERROR]?.push({
                id: 'retry-button',
                style: 'tinted-on-back',
                mode: 'section',
                label: 'تلاش مجدد',
              });
            }
          } else if (this.statusData()?.status === this.statusEnum.FAILED) {
            const find = this.buttons[this.statusEnum.FAILED]?.find((item) => item.id === 'retry-button');
            if (!find) {
              this.buttons[this.statusEnum.FAILED]?.unshift({
                id: 'retry-button',
                style: 'fill',
                mode: 'form',
                label: 'تلاش مجدد',
                fullWidth: true,
              });
            }
          }
        }
        if (this.statusData()?.status === this.statusEnum.PENDING) {
          this.setPendingStatusData();
        }
        this.pageTitle.update((title) => response.pageTitle || title);
        this.gettingData.set(false);
      },
      (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.goBack();
      },
    );
  }

  goBack() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
    );
  }

  nextStep() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}/next`),
    );
  }

  retry() {
    this.gettingData.set(true);
    this.creditApiService.retryBankAccountVerificationStatus(this.creditId, this.fundProviderCode).subscribe({
      next: () => {
        this.setPendingStatusData();
        this.gettingData.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.gettingData.set(false);
      },
    });
  }

  setPendingStatusData() {
    this.statusData.update((statusData) => ({
      ...statusData!,
      status: this.statusEnum.PENDING,
      checkCountDown: 10,
      title: `در حال استعلام اطلاعات از بانک ${FUND_PROVIDER_TRANSLATOR[this.fundProviderCode]}`,
      imageId: 'bank-account-status-pending',
      message: 'پس از دریافت اطلاعات شما نتیجه را اعلام می‌کنیم. لطفا چند دقیقه‌ای منتظر باشید...',
    }));
    this.errors.set([]);
    // Start polling after 10 seconds using setTimeout to avoid stack overflow
    this.startPolling();
  }

  startPolling() {
    // Clear any existing timeout
    this.clearPolling();
    // Schedule next getData call after 10 seconds
    this.pollingTimeoutId = setTimeout(() => {
      this.getData();
    }, 10000);
  }

  clearPolling() {
    if (this.pollingTimeoutId) {
      clearTimeout(this.pollingTimeoutId);
      this.pollingTimeoutId = null;
    }
  }

  ngOnDestroy() {
    this.clearPolling();
  }

  goToShahab() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(
        `/wallet/activation/bank-account-verification/${this.fundProviderCode}/${this.creditId}/shahab-help`,
      ),
    );
  }

  onActionClick(): void {
    window.open('tel:+982153924000');
  }

  onCtaClick(id: string): void {
    switch (id) {
      case 'success-button':
        this.nextStep();
        return;
      case 'back-button':
      case 'unavailable-button':
        this.goBack();
        return;
      case 'retry-button':
        this.retry();
        return;
    }
  }

  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
}
