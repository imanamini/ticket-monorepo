import { Component, inject, OnInit, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import {
  HOME_ROUTE,
  PORTFO,
  RECEIPT_ROUTE,
  SEJAM_ERROR_ROUTE,
  SEJAM_NATIONAL_ID_ROUTE,
  SEJAM_SUCCESS_ROUTE,
} from '../../data-access/constants/app-routes';
import { NotifyMeService } from '../notify-me/services/notify-me.service';
import { Observable, of, switchMap } from 'rxjs';
import { NgxIcon } from '@digipay/ngx-icon';
import { RemoveOrderBottomSheetComponent } from './components/remove-order-bottom-sheet/remove-order-bottom-sheet.component';
import { AlertMeNoticeComponent } from './components/alert-me-notice/alert-me-notice.component';
import { PreRegisterNoticeComponent } from './components/pre-register-notice/pre-register-notice.component';
import { EAlertNotice } from './models/alert-notice.enum';
import { ImageComponent } from '../../shared/components/image/image.component';

import { FundDataService } from '../../components/core/services/fund-data.service';
import { ActivatedRoute } from '@angular/router';
import { IPayment } from '../../components/core/models/payment.interface';
import { PaymentHandlerService } from '../purchase/services/payment-handler.service';
import { ErrorCodes } from '../../data-access/enums/error-codes';
import { IPOTableInfoPipe } from './pipes/ipo-table-info.pipe';
import { IButton } from './models/ipo-buttons.interface';
import { EIPOStatus, IIPOProfile } from './models/ipo-profile.interface';
import { IPOService } from './services/ipo.service';
import { EIPOButtons } from './models/ipo-buttons.enum';
import { BnplBannerComponent } from '../../shared/components/bnpl-banner/bnpl-banner/bnpl-banner.component';
import { OrderStatus } from '../../data-access/enums/order-status';
import { ProfileService } from '../../components/core/services/profile.service';
import { UserInfoModel } from '../user-profile/models/user-info.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { NgClass } from '@angular/common';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'app-initial-supply',
  standalone: true,
  imports: [
    PipesModule,
    NgxButtonComponent,
    IPOTableInfoPipe,
    NgxAppBarComponent,
    NgxIcon,
    ImageComponent,
    BnplBannerComponent,
    SpinnerComponent,
    NgClass,
    NgxDividerComponent,
  ],
  templateUrl: './ipo.component.html',
  styleUrl: './ipo.component.scss',
})
export class IPOComponent implements OnInit {
  buttons = signal<IButton[]>([]);
  profile = signal<IIPOProfile | undefined>(undefined);
  symbol = signal<string | undefined>(undefined);
  loading = signal<boolean>(true);
  bnpl = signal<boolean>(false);
  userProfile = signal<UserInfoModel | undefined>(undefined);

  displayStatusInformation = signal<boolean>(false);
  ipoStatusInformation = signal<
    | {
        iconName: string;
        bgColor: string;
        iconColor: string;
        title?: string;
        description?: string;
      }
    | undefined
  >(undefined);

  private ipoService = inject(IPOService);
  private profileService = inject(ProfileService);
  private activatedRoute = inject(ActivatedRoute);
  private fundDataService = inject(FundDataService);
  private notifyMeService = inject(NotifyMeService);
  private bottomSheet = inject(NgxBottomSheetService);
  private navigationService = inject(WealthNavigationService);
  private paymentHandlerService = inject(PaymentHandlerService);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly EIPOStatus = EIPOStatus;

  ngOnInit() {
    this.symbol.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getProfile();
  }

  private getProfile() {
    this.loading.set(true);
    this.ipoService
      .getProfile(this.symbol())
      .pipe(
        switchMap((profile) => {
          if (profile?.success) {
            this.profile.set(profile.result);
            this.handleStatusInformation();
            this.profile().transactionId = '201-039';
          }
          return this.notifyMeService.hasInform('ipo-' + this.symbol());
        }),
      )
      .subscribe((res) => {
        if (res?.success && this.profile().openNotifyMe) {
          this.buttons().unshift({
            id: EIPOButtons.NOTIFY_ME,
            label: res.result ? 'خبرتان میکنیم' : 'خبرم کن!',
            style: 'tinted-on-elevated',
            isActive: true,
            disabled: !!res.result,
            leftIcon: { name: 'notification', type: 'linear' },
          });
        }
        this.generateButtons();
        this.loading.set(false);
      });

    this.profileService.getProfile().subscribe((res) => {
      if (res?.success) {
        this.userProfile.set(res.result);
      }
    });
  }

  private generateButtons() {
    switch (this.profile().status) {
      case EIPOStatus.PreOrderNotRegistered:
        this.buttons().push({
          id: EIPOButtons.BUY_PENDING,
          label: 'درخواست خرید',
          style: 'fill',
          isActive: true,
          leftIcon: null,
        });
        break;

      case EIPOStatus.PreOrderRegistered:
        this.buttons.set([
          {
            id: EIPOButtons.REMOVE_BUY_ORDER,
            label: 'حذف درخواست خرید',
            style: 'fill',
            isActive: true,
            leftIcon: null,
          },
        ]);
        break;

      case EIPOStatus.FinishedRegistered:
        if (this.profile().transactionStatus === OrderStatus.Draft) {
          this.buttons.set([
            {
              id: EIPOButtons.DISPLAY_ORDER_RECEIPT,
              label: 'مشاهده رسید خرید',
              style: 'fill',
              isActive: true,
              leftIcon: null,
            },
          ]);
        } else {
          if (this.profile().transactionId) {
            this.buttons.set([
              {
                id: EIPOButtons.DISPLAY_PORTFO,
                label: 'مشاهده سبد دارایی',
                style: 'fill',
                isActive: true,
                leftIcon: null,
              },
            ]);
          } else {
            this.buttons.set([
              {
                id: EIPOButtons.REMOVE_BUY_ORDER,
                label: 'حذف درخواست خرید',
                style: 'fill',
                isActive: true,
                leftIcon: null,
              },
            ]);
          }
        }
        break;

      case EIPOStatus.FinishedNotRegistered:
        this.buttons.set([]);
        break;
    }
  }

  action(id: EIPOButtons | string) {
    switch (id) {
      case EIPOButtons.BUY_PENDING:
        this.preRegisterConfirm(id);
        break;

      case EIPOButtons.REMOVE_BUY_ORDER:
        this.confirmRemoveOrder(id);
        break;

      case EIPOButtons.DISPLAY_PORTFO:
        this.navigationService.navigate([PORTFO]);
        break;

      case EIPOButtons.NOTIFY_ME:
        this.notify(id);
        break;
      case EIPOButtons.DISPLAY_ORDER_RECEIPT:
        // receipt?uniqueId
        this.navigationService.navigate([RECEIPT_ROUTE], {
          queryParams: {
            uniqueId: this.profile().transactionId,
          },
        });
        break;
    }
    this.buttons().find((btn) => btn.id === id).loading = true;
  }

  private verifyCustomer(btnId: EIPOButtons) {
    this.buttons().find((btn) => btn.id === btnId).loading = true;
    this.fundDataService.verifyCustomer(this.symbol()).subscribe((verifyResult) => {
      if (verifyResult?.success) {
        const payment: IPayment = this.generatePaymentData();
        const state = this.generateStateDate();
        this.paymentHandlerService.setPayment(payment);
        this.paymentHandlerService.handleState(verifyResult.result.state, state);
      } else {
        // ! Customer is not sejami
        if (verifyResult?.error?.code === ErrorCodes.CustomerIsNotSejami) {
          this.navigationService.navigate([SEJAM_ERROR_ROUTE], {
            state: {
              title: verifyResult.error.title,
              description: verifyResult.error.description,
            },
          });
        }
      }

      this.buttons().find((btn) => btn.id === btnId).loading = false;
    });
  }

  private confirmRemoveOrder(btnId: EIPOButtons) {
    this.bottomSheet.openBottomSheet(RemoveOrderBottomSheetComponent, {
      selectedPaymentMethod: this.profile().paymentMethod,
    });

    const bottomSheetService = this.bottomSheet.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheet.outputData();
      if (result) {
        this.removeOrder(btnId);
      }
      this.buttons().find((btn) => btn.id === btnId).loading = false;
    });
  }

  private notify(btnId: EIPOButtons) {
    this.notifyMeService
      .hasInform('ipo-' + this.symbol())
      .pipe(
        switchMap((res) => {
          if (res?.success && res.result) {
            return of(res);
          }
          return this.notifyMeService.inform('ipo-' + this.symbol());
        }),
        switchMap(() => {
          this.bottomSheet.openBottomSheet(AlertMeNoticeComponent, {});

          return new Observable<any>((observer) => {
            const subscription = this.bottomSheet.onClose.subscribe(() => {
              const result = this.bottomSheet.outputData();
              observer.next(result);
              observer.complete();
              subscription.unsubscribe();
            });
            return () => subscription.unsubscribe();
          });
        }),
      )
      .subscribe((res) => {
        if (res === EAlertNotice.CHECK_SEJAM) {
          if (this.userProfile()?.isSejami) {
            this.navigationService.navigate([SEJAM_SUCCESS_ROUTE], {
              state: { hasAccess: true, prevRoute: 'home' },
            });
          } else {
            this.navigationService.navigate([SEJAM_NATIONAL_ID_ROUTE]);
          }
        }

        this.buttons().find((btn) => btn.id === btnId).loading = false;
        this.buttons().find((btn) => btn.id === btnId).label = 'خبرتان میکنیم';
        this.buttons().find((btn) => btn.id === btnId).disabled = true;
      });
  }

  private removeOrder(btnId: EIPOButtons) {
    this.ipoService.removeOrder(this.symbol()).subscribe((res) => {
      if (res.result) {
        this.profile().status = EIPOStatus.PreOrderNotRegistered;
        const btnIndex = this.buttons().findIndex((btn) => btn.id === btnId);
        this.buttons().splice(btnIndex, 1);
        this.getProfile();
      }

      this.buttons().find((btn) => btn.id === btnId).loading = false;
    });
  }

  private preRegisterConfirm(btnId: EIPOButtons) {
    this.bottomSheet.openBottomSheet(PreRegisterNoticeComponent, {
      ipo: {
        name: this.profile().title,
        date: this.profile().date,
      },
    });

    const bottomSheetService = this.bottomSheet.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheet.outputData();
      if (result?.continue) {
        this.verifyCustomer(btnId);
      } else {
        this.buttons().find((btn) => btn.id === btnId).loading = false;
      }
    });
  }

  private generatePaymentData(): IPayment {
    return {
      symbol: this.symbol(),
      amount: 0,
      agreementChecked: true,
      instrumentUnit: 0,
      units: 0,
      type: 'IPO',
      assetData: this.profile(),
    };
  }

  private generateStateDate() {
    return {
      symbol: this.symbol(),
      type: 'IPO',
      agreementChecked: true,
      amount: 0,
      investmentType: '',
      assetData: this.profile(),
      unitCount: 0,
    };
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  private handleStatusInformation() {
    const activeStatuses = [EIPOStatus.PreOrderRegistered, EIPOStatus.FinishedNotRegistered, EIPOStatus.FinishedRegistered];

    this.displayStatusInformation.set(activeStatuses.includes(this.profile().status));

    const statusConfig: Record<EIPOStatus, () => any> = {
      [EIPOStatus.PreOrderRegistered]: () => ({
        bgColor: 'surface-success-tint',
        iconName: 'info-circle',
        iconColor: 'text-onback-success',
        description: 'خرید شما در حال انجام است...',
      }),
      [EIPOStatus.FinishedNotRegistered]: () => ({
        bgColor: 'surface-error-tint',
        iconName: 'error-circle',
        iconColor: 'text-onback-error',
        title: 'فرصت سرمایه‌گذاری تمام شد',
        description: 'منتظر فرصت‌های بعدی باشید.',
      }),
      [EIPOStatus.FinishedRegistered]: () => {
        const isRejected =
          this.profile().transactionStatus === OrderStatus.RejectedBySystem ||
          this.profile().transactionStatus === OrderStatus.RejectedByManager;

        const isApproved = this.profile().transactionStatus === OrderStatus.Approved;

        return {
          bgColor: isRejected ? 'surface-error-tint' : 'surface-success-tint',
          iconName: 'info-circle',
          iconColor: isRejected ? 'text-onback-error' : 'text-onback-success',
          title: isApproved ? 'سرمایه‌گذاری شما انجام شد' : 'سرمایه‌گذاری شما انجام نشد',
          description: isApproved
            ? 'می‌توانید سرمایه‌گذاری خود را در سبد دارایی مشاهده کنید.'
            : isRejected
              ? 'ممکن است در کارگزاری دیگری درخواست خود را ثبت کرده باشید یا موجودی کیف پول ETF شما کافی نبوده باشد.'
              : 'خرید شما در حال انجام است...',
        };
      },
      [EIPOStatus.PreOrderNotRegistered]: () => {
        return null;
      },
    };

    if (activeStatuses.includes(this.profile().status)) {
      this.ipoStatusInformation.set(statusConfig[this.profile().status]());
    }
  }
}
