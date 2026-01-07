import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UiOption } from '../../../../ui/models/ui-option';
import { InternetService } from '../internet.service';
import { ActivatedRoute } from '@angular/router';
import { PackageGroup } from '../models/package-group';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UiInternetPackageConfirmComponent } from '../../../../ui/ui-sub/ui-internet/ui-internet-package-confirm/ui-internet-package-confirm.component';
import { PaymentService } from '../../../../core/services/payment.service';
import { ConfirmInternetPackageDialogResult } from '../../../../ui/ui-sub/ui-internet/ui-internet-package-confirm/models/confirm-internet-package-dialog-result';
import { MessageService } from '@client-monorepo/common/utilities';
import { UserService } from '../../../../core/services/user.service';
import { ConfirmInternetPackageDialogData } from '../../../../ui/ui-sub/ui-internet/ui-internet-package-confirm/models/confirm-internet-package-dialog-data';
import { Subscription } from 'rxjs';
import { SimType } from '../../../../api/digipay/models/common/sim-type';
import { LayoutService } from '../../../services/layout.service';
import { InternetApiService } from '../../../../api/digipay/internet-api.service';
import { ScreenSize } from '../../../../api/digipay/models/common/screen-size';
import {
  CreateInternetPurchaseTicketRequest,
  CreateInternetPurchaseTicketResponse,
  InternetPackage,
} from '../../../../api/digipay/models/internet';
import { SwiperOptions } from 'swiper/types';
import { OperatorIds } from '../../../../api/digipay/models/carrier/operator-ids';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiWarningMessageComponent } from '../../../../ui/ui-components/ui-message-box/ui-warning-message/ui-warning-message.component';
import { UiInternetPackageComponent } from '../../../../ui/ui-sub/ui-internet/ui-internet-package/ui-internet-package.component';
import { UiSpinnerComponent } from '../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { UiFormHintComponent } from '../../../../ui/ui-components/ui-hint-text/ui-form-hint/ui-form-hint.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UiLightWarningComponent } from '../../../../ui/ui-components/ui-hint-text/ui-light-warining/ui-light-warning.component';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-internet-package-select',
  templateUrl: './internet-package-select.component.html',
  styleUrls: ['./internet-package-select.component.scss'],
  standalone: true,
  imports: [
    UiLightWarningComponent,
    NgIf,
    UiFormHintComponent,
    UiSpinnerComponent,
    NgFor,
    NgClass,
    UiInternetPackageComponent,
    UiWarningMessageComponent,
    SwiperDirective,
  ],
})
export class InternetPackageSelectComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  durations: UiOption[] = [];

  selectedDuration = -1;

  cellNumber = '';

  simType: SimType = null;

  carrier: OperatorIds = null;

  gridColumns = 2;

  isMobile = false;

  packages: PackageGroup[] = [];

  gettingPackages = false;

  paymentInProgress = false;

  serviceMessage = null;

  needsReload = false;

  anyPackageToShow = false;

  gettingPaymentTicket = false;

  queryParams: any;

  hasCheckedPreSelectedBundleId = false;

  basicDataValidness: {
    cellNumber: boolean;
    simType: boolean;
    carrier: boolean;
  };

  validationMessages: {
    cellNumber: string;
  };

  subscriptions: Subscription[] = [];

  swiperConfig: SwiperOptions = {
    navigation: false,
    slidesPerView: 'auto',
    spaceBetween: 8,
    allowTouchMove: true,
    slideToClickedSlide: true,
  };

  constructor(
    private layoutService: LayoutService,
    public internetService: InternetService,
    private internetApiService: InternetApiService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private paymentService: PaymentService,
    private user: UserService,
    private messageService: MessageService,
  ) {
    this.queryParams = this.route.snapshot.queryParams;

    const cellNumber = this.internetService.cellNumber.getValue();
    // if (!cellNumber) {
    //   this.router.navigate(['..'], {
    //     relativeTo: this.route
    //   });
    // }
  }

  ngOnInit(): void {
    this.paymentService.getWalletBalance();

    this.subscriptions[0] = this.layoutService.screenSizeChanged.subscribe((size) => {
      this.isMobile = size === ScreenSize.isMobile;
    });

    this.internetService.getPackages();

    this.subscriptions[1] = this.internetService.cellNumber.asObservable().subscribe((val) => {
      this.cellNumber = val;
    });

    this.subscriptions[2] = this.internetService.gettingPackages.asObservable().subscribe((val) => {
      this.gettingPackages = val;
    });

    this.subscriptions[3] = this.internetService.selectedCarrier.asObservable().subscribe((carrierOption) => {
      if (carrierOption) {
        this.carrier = carrierOption.value;
      } else {
        this.carrier = null;
      }
    });

    this.subscriptions[4] = this.internetService.selectedSimType.asObservable().subscribe((val) => {
      this.simType = val;
    });

    this.subscriptions[5] = this.internetService.durations.asObservable().subscribe((durations) => {
      this.durations = durations;
    });

    this.subscriptions[6] = this.internetService.selectedDuration.asObservable().subscribe((val) => {
      this.selectedDuration = val;
    });

    this.subscriptions[7] = this.internetService.packages.asObservable().subscribe((val) => {
      this.needsReload = false;
      this.packages = val;
      if (this.packages.length > 0 && !this.hasCheckedPreSelectedBundleId) {
        this.checkPreSelectedBundleId();
      }
    });

    this.subscriptions[8] = this.internetService.anyPackageToShow.asObservable().subscribe((val) => {
      this.anyPackageToShow = val;
    });

    this.subscriptions[9] = this.internetService.serviceMessage.asObservable().subscribe((message) => {
      this.serviceMessage = message;
    });

    this.subscriptions[10] = this.internetService.basicDataValidness.asObservable().subscribe((basicDataValidness) => {
      this.basicDataValidness = basicDataValidness;
    });

    this.subscriptions[11] = this.internetService.validationMessages.asObservable().subscribe((validationMessages) => {
      this.validationMessages = validationMessages;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  // onCellNumberChange(cellNumber: string): void {
  //   this.needsReload = true;
  //   this.internetService.cellNumber.next(cellNumber);
  // }

  // onSimTypeChange(option: UiOption): void {
  //   this.needsReload = true;
  //   this.simType = +option.value;
  //   this.internetService.selectedSimType.next(+option.value);
  // }

  // onCarrierChange(option: UiOption): void {
  //   this.needsReload = true;
  //   this.carrier = option.value;
  //   const carrier = this.internetService.carriers.filter(c => c.value === option.value)[0];
  //   this.internetService.selectedCarrier.next(carrier);
  //   check the sim-type value
  // const simTypes = this.internetService.simTypesGroups[carrier.value];
  // const simType = this.internetService.selectedSimType.getValue();
  // if (simTypes.filter(s => s.value === simType).length === 0) {
  // new carrier doesn't have the previously selected sim-type
  // fallback to the first available sim-type
  // this.internetService.selectedSimType.next(simTypes[0].value);
  // }
  // }

  onDurationChange(option: UiOption): void {
    this.internetService.selectedDuration.next(option.value);
  }

  // getPackages(): void {
  //   this.internetService.selectedDuration.next(-1);
  //   this.internetService.getPackages();
  // }

  onPackageClick(internetPackage: InternetPackage): void {
    this.openPackageDialog(internetPackage)
      .afterClosed()
      .subscribe((result: ConfirmInternetPackageDialogResult) => {
        if (!result) {
          return;
        }
        if (this.gettingPaymentTicket) {
          return;
        }
        this.paymentInProgress = true;
        this.getTicketForPackagePurchase(internetPackage)
          .then((res: CreateInternetPurchaseTicketResponse) => {
            switch (result.result) {
              case 'WALLET':
                this.paymentService
                  .payByWallet(res.ticket)
                  .catch((e) => {
                    typeof e === 'string' ? this.messageService.showErrorMessage(e) : this.messageService.showErrorOfErrorResponse(e);
                  })
                  .finally(() => {
                    this.paymentInProgress = false;
                  });
                break;
              case 'IPG':
                if (this.paymentService.payUsingTheNativeSdk(res)) {
                  return;
                }
                this.paymentService
                  .payByIpg(res.ticket)
                  .catch((e) => {
                    typeof e === 'string' ? this.messageService.showErrorMessage(e) : this.messageService.showErrorOfErrorResponse(e);
                  })
                  .finally(() => {
                    this.paymentInProgress = false;
                  });
                break;
            }
          })
          .catch((e) => {
            this.messageService.showErrorOfErrorResponse(e);
          })
          .finally(() => {
            this.paymentInProgress = false;
          });
      });
  }

  private openPackageDialog(internetPackage: InternetPackage): MatDialogRef<any> {
    // return
    // this.isMobile ? this.bottomSheetMatDialog.open(UiInternetPackageConfirmComponent, {
    //   data: {
    //     internetPackage,
    //     cellNumber: this.cellNumber,
    //     carrier: this.carrier,
    //     isLoggedIn: this.user.isLoggedIn.getValue(),
    //     walletBalance: this.paymentService.walletBalance.getValue(),
    //   }
    // })
    //   :
    return this.matDialog.open(UiInternetPackageConfirmComponent, {
      maxWidth: '90vw',
      width: '650px',
      data: {
        internetPackage,
        cellNumber: this.cellNumber,
        carrier: this.carrier,
        isLoggedIn: this.user.isLoggedIn.getValue(),
        walletBalance: this.paymentService.walletBalance.getValue(),
      } as ConfirmInternetPackageDialogData,
    });
  }

  private checkPreSelectedBundleId(): void {
    this.hasCheckedPreSelectedBundleId = true;
    const bundleId = this.queryParams.bundleId;
    if (!bundleId) {
      return;
    }
    // sometimes one package may found more than once,
    // trust the first one and ignore the others!
    let found = false;
    this.packages.forEach((group) => {
      const filtered = group.packages.filter((p) => p.bundleId === bundleId);
      if (filtered.length > 0 && !found) {
        found = true;
        this.onPackageClick(filtered[0]);
      }
    });
  }

  private getTicketForPackagePurchase(internetPackage: InternetPackage): Promise<CreateInternetPurchaseTicketResponse> {
    return new Promise((resolve, reject) => {
      const request = this.makeApiParameters(internetPackage);
      this.gettingPaymentTicket = true;
      this.internetApiService.createInternetPurchase(request).subscribe(
        (response) => {
          this.gettingPaymentTicket = false;
          resolve(response);
        },
        (e) => {
          this.gettingPaymentTicket = false;
          reject(e);
        },
      );
    });
  }

  private makeApiParameters(internetPackage: InternetPackage): CreateInternetPurchaseTicketRequest {
    const url = this.paymentService.generatePaymentUrl('internet');
    return {
      internetPackage: {
        amount: internetPackage.amount,
        bundleId: internetPackage.bundleId,
        description: internetPackage.description,
        duration: internetPackage.duration,
      },
      operatorId: this.carrier,
      redirectUrl: url,
      targetedCellNumber: this.cellNumber,
    } as CreateInternetPurchaseTicketRequest;
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }
}
