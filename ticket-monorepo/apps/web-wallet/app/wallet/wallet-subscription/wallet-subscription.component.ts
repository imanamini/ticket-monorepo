import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletApiService } from '../../api/wallet-api.service';
import { SubscriptionGroupResponse } from '../../api/models/subscription-groups.response';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { SubscriptionDialogComponent } from '../../user-interface/dialogs/subscription-dialog/subscription-dialog.component';
import { OtpPinDialogComponent } from '../../user-interface/dialogs/otp-pin-dialog/otp-pin-dialog.component';
import { TacResponse } from '../../api/models/tac.response';
import { PageDialogComponent } from '../../user-interface/dialogs/page-dialog/page-dialog.component';
import { MessageService } from '../../core/services/message.service';
import { StorageService } from '../../core/services/storage.service';
import { RedirectService } from '../../core/services/redirect.service';
import { FEATURE_NAMES, FEATURES, PROTECTIONS } from '../../api/constants';
import { NumberPersianText, TimePersianUnit } from './wallet-subscription.constants';
import { SubscriptionTicketInfoResponse } from '../../api/models/ticket-info.response';
import { GA_SUBSCRIPTION_ID } from '../../api/constants/ga-subscription-id';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallet-subscription',
  templateUrl: './wallet-subscription.component.html',
  styleUrls: ['./wallet-subscription.component.scss']
})
export class WalletSubscriptionComponent implements OnInit, OnDestroy {

  isAcceptTc = false;

  templatesInfo: Array<SubscriptionGroupResponse> = null;

  selectedTemplate: SubscriptionGroupResponse = null;

  cashedTemplateInfo = {
    time: 0,
    fromManagement: false,
    templateId: ''
  };

  cashedTemplateId;

  isLoading = false;

  walletBalance: number;

  tacResponse: TacResponse;

  gettingTac = false;

  showAllTemplates = false;

  contractAlreadyExist = false;

  walletIsActivating = false;

  fetchDataRetryCount = 2;

  tokenExpired = false;

  timePersianUnit: {};

  numberPersianText: {};

  ticketInfo: SubscriptionTicketInfoResponse;

  GA_SUBSCRIPTION_ID = GA_SUBSCRIPTION_ID;

  tcRequestSubscription: Subscription;

  constructor(
    private router: Router,
    private overlay: Overlay,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private walletApi: WalletApiService,
    private storageService: StorageService,
    private messageService: MessageService,
    private redirectService: RedirectService,
  ) {
    this.windowResizeCallback = this.windowResizeCallback.bind(this);
  }

  ngOnInit() {
    this.timePersianUnit = TimePersianUnit;
    this.numberPersianText = NumberPersianText;
    const ticket = this.getTicket();
    this.storageService.put({ticket});
    this.cashedTemplateInfo = JSON.parse(localStorage.getItem('cashedSubscribeTemplate'));
    if (this.cashedTemplateInfo && (this.cashedTemplateInfo.time) > new Date().getTime() - 900000) {
      this.cashedTemplateId = this.cashedTemplateInfo.templateId;
    } else {
      localStorage.removeItem('cashedSubscribeTemplate');
    }
    localStorage.removeItem('successTemplateInfo');
    this.isLoading = true;
    this.getTac();
    window.addEventListener('resize', this.windowResizeCallback);
    this.setCallbackUrl(localStorage.getItem('subscCallbackUrl'));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.windowResizeCallback);
  }

  windowResizeCallback() {
    this.showAllTemplates = window.matchMedia('(max-width: 812px)').matches;
  }

  getTac() {
    this.walletApi.inAppTac(this.getTicket()).subscribe(tacResponse => {
      this.tacResponse = tacResponse;
      this.tokenExpired = false;
      this.fetchTemplates();
    }, (e) => {
      if (e && e.status === 401) {
        this.tokenExpired = true;
        this.messageService.showErrorMessage('خطا در اعتبارسنجی');
        setTimeout(() => {
          this.closeSubscription();
        }, 3000);
      }
      this.isLoading = false;
    });
  }

  fetchTemplates() {
    this.isLoading = true;
    this.walletApi.getSubscriptionTicketInfo(this.getTicket(), this.tacResponse).subscribe(info => {
      this.ticketInfo = info;
      this.walletBalance = info.walletBalance;
      localStorage.setItem('subscCallbackUrl', info.callbackUrl);
      this.setCallbackUrl(info.callbackUrl);
      this.walletApi.getSubscriptionTemplateByGroup(this.getTicket(), info.templateGroupId).subscribe(group => {
          this.templatesInfo = group.templates.filter((item) => item.status === 1);
          this.windowResizeCallback();
          if (this.templatesInfo.length === 1) {
            this.selectedTemplate = this.templatesInfo[0];
          } else {
            this.selectedTemplate = null;
          }
          if (this.cashedTemplateId) {
            this.templatesInfo.forEach((item) => {
              if (item.templateId === this.cashedTemplateId) {
                this.selectedTemplate = item;
                if (this.cashedTemplateInfo && this.cashedTemplateInfo.fromManagement === false) {
                  this.handleConfirmButton();
                }
                return;
              }
            });
          }
        }, (() => {
        }),
        () => {
          this.isLoading = false;
        });
    }, (e) => {
      if (e && e.error && e.error.result && e.error.result.title && e.error.result.title === 'WALLET_USER_NOT_FOUND') {
        this.walletIsActivating = true;
        setTimeout(() => {
          if (this.fetchDataRetryCount > 0) {
            this.fetchTemplates();
            this.fetchDataRetryCount--;
          } else {
            this.isLoading = false;
            this.walletIsActivating = false;
          }
        }, 2000);
      } else {
        this.isLoading = false;
      }
    });

  }

  toggleAcceptTcStatus() {
    this.isAcceptTc = !this.isAcceptTc;
  }

  /**
   * Get ticket from URL
   */
  private getTicket() {
    return this.route.snapshot.paramMap.get('ticket');
  }

  selectTemplateItem(event) {
    this.selectedTemplate = event;
  }

  backToTemplateList() {
    this.selectedTemplate = null;
    this.isAcceptTc = false;
  }

  handleConfirmButton() {
    this.gettingTac = false;
    if (this.tcRequestSubscription) {
      this.tcRequestSubscription.unsubscribe();
    }
    if (this.walletBalance >= this.selectedTemplate.periodicAmount) {
      this.register();
    } else {
      this.cashIn();
    }
  }

  private register() {
    const walletFeature = this.tacResponse.features[FEATURES[FEATURE_NAMES.PAYMENT_WALLET]];
    let currentProtection;
    switch (walletFeature.isProtected) {
      case PROTECTIONS.IN_APP_VERIFICATION:
      case PROTECTIONS.OTP:
        currentProtection = 'OTP';
        break;
      case PROTECTIONS.PIN:
        currentProtection = 'PIN';
        break;
      case PROTECTIONS.NONE:
        // NOTHING, JUST PAY
        this.finalizePayment();
        break;
    }
    const params = {
      templateId: this.selectedTemplate.templateId,
      ticket: this.getTicket()
    };
    this.verify(currentProtection).afterClosed().subscribe((data) => {
      localStorage.removeItem('cashedSubscribeTemplate');
      if (data && (data.confirmed || data.verified)) {
        this.walletApi.registerSubscriptionTemplate(params).subscribe(() => {
          this.finalizePayment();
        }, (e) => {
          if (e && e.error && e.error.result && e.error.result.title === 'SUBSCRIPTION_CONTRACT_ALREADY_EXISTS') {
            this.contractAlreadyExist = true;
            this.messageService.showErrorMessage(
              'شما در حال حاضر یک اشتراک دارید، برای مدیریت اشتراک‌های فعال به صفحه مربوطه منتقل خواهید شد.'
            );
            setTimeout(() => {
              this.router.navigateByUrl('/manage-subscriptions/' + this.getTicket());
            }, 2000);
          } else {
            let callbackUrl = localStorage.getItem('subscCallbackUrl');
            if (this.ticketInfo && callbackUrl.indexOf('providerId') === -1) {
              const queryStringSeparator = callbackUrl.indexOf('?') === -1 ? '?' : '&';
              callbackUrl = (callbackUrl + queryStringSeparator + 'providerId=' + this.ticketInfo.providerId + '&status=failed');
              this.setCallbackUrl(callbackUrl);
              this.closeSubscription();
            }
          }
        });
      }
    });
  }

  private cashIn() {
    this.cacheTemplate();
    const requiredAmount = Math.abs(this.walletBalance - this.selectedTemplate.periodicAmount);
    return this.matDialog.open(SubscriptionDialogComponent, {
      width: '400px',
      maxWidth: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        id: {
          view: GA_SUBSCRIPTION_ID.CONTRACT.INSUFFICIENT_BALANCE_FOR_ACTIVATION_VIEW,
          back: GA_SUBSCRIPTION_ID.CONTRACT.CANCEL_CASH_IN_CLICK,
          submit: GA_SUBSCRIPTION_ID.CONTRACT.PROCEED_WITH_CASH_IN_CLICK
        },
        walletBalance: this.walletBalance,
        requiredAmount: requiredAmount < 100000 ? 100000 : requiredAmount
      }
    }).afterClosed().subscribe(() => {
      localStorage.removeItem('cashedSubscribeTemplate');
    });
  }

  private verify(protection: 'PIN' | 'OTP') {
    return this.matDialog.open(OtpPinDialogComponent, {
      width: '400px',
      maxWidth: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        amount: null,
        walletBalance: this.walletBalance,
        userDetail: this.tacResponse.userDetail,
        protection,
        features: [0],
        showSubscriptionMessages: true
      }
    });
  }

  showTcDialog() {
    if (this.gettingTac) {
      return;
    }
    this.gettingTac = true;
    this.tcRequestSubscription = this.walletApi.getTextFile('static/subscription-tac').subscribe(response => {
      this.gettingTac = false;
      this.matDialog.open(PageDialogComponent, {
        maxWidth: '90%',
        maxHeight: '80vh',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        panelClass: [
          'page-dialog-component'
        ],
        data: {
          html: response,
          title: 'شرایط استفاده'
        }
      });
    }, e => {
      this.gettingTac = false;
      if (e.error && e.error.result) {
        this.messageService.showErrorIfExists(e);
      } else {
        this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
      }
    });
  }

  finalizePayment() {
    const templateParams = {
      type: 'wallet',
      ticket: this.getTicket()
    };
    this.walletApi.subscriptionPay(templateParams).subscribe((r) => {
      localStorage.setItem('successTemplateInfo', JSON.stringify(this.selectedTemplate));
      this.router.navigateByUrl('/success-subscriptions/' + this.getTicket());
    });
  }

  redirectToActivities() {
    if (this.selectedTemplate) {
      this.cacheTemplate(true);
    }
    this.router.navigateByUrl('/manage-subscriptions/' + this.getTicket() + '/1');
  }

  cacheTemplate(forManagment = false) {
    const cashTemplateInfo = {
      time: new Date().getTime(),
      fromManagement: forManagment,
      templateId: this.selectedTemplate.templateId
    };
    localStorage.setItem('cashedSubscribeTemplate', JSON.stringify(cashTemplateInfo));
  }

  closeSubscription() {
    this.redirectService.setAndRedirect([]);
  }

  setCallbackUrl(callbackUrl) {
    this.redirectService.url.next(callbackUrl);
  }

  getValidityDuration() {
    return (this.numberPersianText[this.selectedTemplate.validityDuration.count] ||
        this.selectedTemplate.validityDuration.count) + ' ' +
      this.timePersianUnit[this.selectedTemplate.validityDuration.timeUnit].persianUnit;
  }

  getPaymentPeriodDuration() {
    return (this.numberPersianText[this.selectedTemplate.paymentPeriodDuration.count] ||
        this.selectedTemplate.paymentPeriodDuration.count) + ' ' +
      this.timePersianUnit[this.selectedTemplate.paymentPeriodDuration.timeUnit].persianUnit;
  }

  getTrialDuration() {
    if (this.selectedTemplate && this.selectedTemplate.trialDuration) {
      return this.selectedTemplate.trialDuration.count + ' ' +
        this.timePersianUnit[this.selectedTemplate.trialDuration.timeUnit].persianUnit +
        ' دوره آزمایشی';
    } else {
      return '';
    }
  }
}
