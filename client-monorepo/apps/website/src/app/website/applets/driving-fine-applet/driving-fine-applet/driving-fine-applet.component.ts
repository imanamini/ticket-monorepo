import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NewPlateFineStates, SelectPlateFineStates } from './car-fine-states';
import { FineStateManagerService } from '../services/fine-state-manager.service';
import { InquiryMethodType } from '../../../../api/digipay/models/driving-fine/inquiry-method';
import { FineDataService } from '../services/fine-data.service';
import { delay, Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { PaymentResult, PaymentResultStatus } from '../../../../api/digipay/models/payment/payment-result';
import { UiDialogPaymentResultComponent } from '../../../../ui/ui-components/ui-dialogs/ui-dialog-payment-result/ui-dialog-payment-result.component';
import { PaymentResultDialogData } from '../../../../ui/ui-components/ui-dialogs/ui-dialog-payment-result/models/payment-result-dialog-data';
import { MatDialog } from '@angular/material/dialog';
import { SectionFineInquiryAndPayment } from '../../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { AutoServicePayment } from '../services/auto-service-payment.service';
import { PaymentType } from '../../../../api/digipay/models/payment/payment-feature';
import { FinePaymentResultComponent } from './fine-payment-result/fine-payment-result.component';
import { FinePaymentComponent } from './fine-payment/fine-payment.component';
import { InquiryCostPaymentComponent } from './inquiry-cost-payment/inquiry-cost-payment.component';
import { InquiryMethodSelectComponent } from './inquiry-method-select/inquiry-method-select.component';
import { CarInfoEnteringComponent } from './car-info-entering/car-info-entering.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-driving-fine-applet',
  templateUrl: './driving-fine-applet.component.html',
  styleUrls: ['./driving-fine-applet.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    CarInfoEnteringComponent,
    InquiryMethodSelectComponent,
    InquiryCostPaymentComponent,
    FinePaymentComponent,
    FinePaymentResultComponent,
  ],
})
export class DrivingFineAppletComponent implements OnInit, OnDestroy {
  @Input() initialData: SectionFineInquiryAndPayment;

  selectedState: NewPlateFineStates | SelectPlateFineStates = NewPlateFineStates.CAR_INFO_ENTERING;

  selectedInquiryMethodType: InquiryMethodType = InquiryMethodType.GENERAL;

  subscriptions: Subscription[] = [];

  protected readonly NewPlateFineStates = NewPlateFineStates;

  private prevParams: Params = {};

  private fineTrackingCode: string;

  constructor(
    private fineStateManager: FineStateManagerService,
    private fineDataService: FineDataService,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private autoServicePayment: AutoServicePayment,
  ) {}

  ngOnInit(): void {
    this.clearPaymentResultQueryParamsOnLoad();

    this.subscriptions[0] = this.fineStateManager.selectedStateType.subscribe((state) => {
      this.selectedState = state;
    });

    this.subscriptions[1] = this.fineDataService.selectedInquiryMethodType.subscribe((selectedInquiryMethodType) => {
      this.selectedInquiryMethodType = selectedInquiryMethodType;
    });

    this.subscriptions[2] = this.route.queryParams.subscribe((params) => {
      this.handleQueryParams(params);
    });

    this.fineDataService.fineInitialData.next(this.initialData);
  }

  handleQueryParams(params: Params) {
    const paramsChanges = this.getQueryParamsChanges(params);
    this.fineTrackingCode = params.fineTrackingCode ? params.fineTrackingCode : this.fineTrackingCode;
    if (paramsChanges.data) {
      const paymentData = JSON.parse(Base64.decode(params.data));
      this.showPaymentResultDialog(paymentData).subscribe(() => {
        if (paymentData.type === PaymentType.INQUIRY_FINE_PAYMENT) {
          this.handleInquiryPaymentScenarios(paymentData);
        } else if (paymentData.type === PaymentType.CASH_IN) {
          this.handleCashInScenarios(params, paymentData);
        } else if (paymentData.type === PaymentType.FINE_PAYMENT) {
          this.handleFinePaymentScenarios(paymentData);
        }

        of('')
          .pipe(delay(0))
          .subscribe({
            next: () => {
              this.router.navigate([], {
                queryParams: {
                  data: null,
                  [this.prevParams.step + 'PaymentStatus']: null,
                },
                queryParamsHandling: 'merge',
              });
            },
          });
      });
    } else if (this.fineTrackingCode && this.fineTrackingCode.length > 0 && paramsChanges.step) {
      if (params.step === 'inquiry') {
        this.fineStateManager.jumpToCertainState(NewPlateFineStates.FINE_PAYMENT);
      }
      if (params.step === 'fine') {
        this.fineStateManager.jumpToCertainState(NewPlateFineStates.FINE_PAYMENT_RESULT);
      }
    }
  }

  clearPaymentResultQueryParamsOnLoad() {
    const paramsSnapshot = this.route.snapshot.queryParams;
    let statusKey;
    if (paramsSnapshot.status) {
      statusKey = 'status';
    }
    if (paramsSnapshot.inquiryPaymentStatus) {
      statusKey = 'inquiryPaymentStatus';
    }
    if (paramsSnapshot.finePaymentStatus) {
      statusKey = 'finePaymentStatus';
    }
    if (statusKey?.length > 0) {
      this.router.navigate([], {
        queryParams: {
          [statusKey]: null,
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  getQueryParamsChanges(params: Params): {
    [key: string]: { prevValue: string; newValue: string };
  } {
    const output: { [key: string]: { prevValue: string; newValue: string } } = {};
    Object.keys(params)
      .concat(Object.keys(this.prevParams))
      .forEach((key) => {
        if (params[key] !== this.prevParams[key]) {
          output[key] = {
            prevValue: this.prevParams[key],
            newValue: params[key],
          };
        }
      });
    this.prevParams = params;
    return output;
  }

  handleCashInScenarios(params: Params, paymentData: PaymentResult) {
    if (params.step) {
      if (params.step === 'inquiry') {
        this.handleInquiryCashInScenario(paymentData);
      } else if (params.step === 'fine') {
        this.handleFineCashInScenario(paymentData);
      }
    }
  }

  handleInquiryCashInScenario(paymentData: PaymentResult) {
    if (paymentData.paymentResult === PaymentResultStatus.SUCCESS) {
      this.fineStateManager.jumpToCertainState(NewPlateFineStates.INQUIRY_COST_PAYMENT);
    } else {
      this.router.navigate([], {
        queryParams: {
          step: null,
        },
        queryParamsHandling: 'merge',
      });
      this.autoServicePayment.deleteAutoPaymentTicket();
    }
  }

  handleFineCashInScenario(paymentData: PaymentResult) {
    if (paymentData.paymentResult === PaymentResultStatus.SUCCESS) {
      this.fineStateManager.jumpToCertainState(NewPlateFineStates.FINE_PAYMENT);
    } else {
      this.router.navigate([], {
        queryParams: {
          step: 'inquiry',
          fineTrackingCode: this.fineTrackingCode,
        },
        queryParamsHandling: 'merge',
      });
      this.autoServicePayment.deleteAutoPaymentTicket();
    }
  }

  handleInquiryPaymentScenarios(paymentData: PaymentResult) {
    const result = paymentData;
    const tempArray = [];
    for (const key in result.activityInfo) {
      const tmpKey = Object.keys(result.activityInfo[key])[0];
      tempArray.push({ key: tmpKey, value: result.activityInfo[key][tmpKey] });
    }
    result.activityInfo = tempArray;
    if (result.paymentResult === PaymentResultStatus.SUCCESS) {
      this.router.navigate([], {
        queryParams: {
          fineTrackingCode: paymentData.trackingCode,
          step: 'inquiry',
        },
      });
    } else {
      this.router.navigate([], {});
    }
  }

  handleFinePaymentScenarios(paymentData: PaymentResult) {
    if (paymentData.paymentResult === PaymentResultStatus.SUCCESS) {
      this.fineStateManager.jumpToCertainState(NewPlateFineStates.FINE_PAYMENT_RESULT);
    } else {
      this.router.navigate([], {
        queryParams: {
          step: 'inquiry',
          fineTrackingCode: this.fineTrackingCode,
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  showPaymentResultDialog(paymentResult: PaymentResult): Observable<any> {
    const result = paymentResult;
    const tempArray = [];
    for (const key in result.activityInfo) {
      const tmpKey = Object.keys(result.activityInfo[key])[0];
      tempArray.push({ key: tmpKey, value: result.activityInfo[key][tmpKey] });
    }
    result.activityInfo = tempArray;
    return this.matDialog
      .open(UiDialogPaymentResultComponent, {
        width: '450px',
        maxWidth: '90%',
        panelClass: ['ui-dialog-container', 'ui-payment-dialog-container'],
        data: {
          paymentResult: result,
          statusKey: this.prevParams.step ? this.prevParams.step + 'PaymentStatus' : null,
        } as PaymentResultDialogData,
      })
      .afterClosed();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub ? sub.unsubscribe() : '';
    });
  }
}
