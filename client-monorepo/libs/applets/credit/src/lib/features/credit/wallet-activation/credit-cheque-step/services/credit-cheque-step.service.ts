import { inject, Injectable, signal } from '@angular/core';
import { CreditChequeStepInterface } from './credit-cheque-step.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreditChequeDocument } from '../../../data-access/models/credit/activation/cheque-step/cheque-step-detail-response.model';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditCacheService } from '../../../data-access/services/credit-cache.service';
import { StepFlow } from '../../../data-access/models/credit/activation/get-activation-step-detail.response';
import { CreditChequeStepErrorDialogComponent } from '../credit-cheque-step-error-dialog/credit-cheque-step-error-dialog.component';
import { MessageService } from '../../../data-access/services/message.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import {
  ChequeStepDeliveryMethod,
  ChequeStepDeliveryReserveInfo,
  DeliveryDate,
  DeliveryProvider,
  SelectedAddressModel,
  TimeSlot,
} from '../../../data-access/models/credit/activation/cheque-step/cheque-step-delivery.model';

export type CreditInstallmentChequeErrorTypes = 'NO_SCORE' | 'INVALID';

@Injectable({
  providedIn: 'root',
})
export class CreditChequeStepService {
  readonly CREDIT_ONB_PICK_UP_CAPACITY_IS_FULL = 5391;
  readonly CREDIT_ONB_PICK_UP_METHOD_NOT_UPDATABLE = 5390;
  readonly CREDIT_ONB_PICK_UP_COLLATERAL_TIME_SLOT_IS_ALREADY_TAKEN = 5388;

  data: CreditChequeStepInterface = {};
  documents = new BehaviorSubject<CreditChequeDocument[]>([]);
  relationList = new BehaviorSubject<{ [key: number]: string }>({});
  invalidIbans = new BehaviorSubject<string[]>([]);
  selectedStepFlow!: StepFlow;
  ownerKycData: {
    ownerName: string;
    ownerBirthCertificate: string;
  } = {
    ownerName: '',
    ownerBirthCertificate: '',
  };
  errorTypeMap: { [key: number]: CreditInstallmentChequeErrorTypes } = {
    5303: 'NO_SCORE',
    5219: 'NO_SCORE',
    5246: 'NO_SCORE',
    160640: 'INVALID',
    1054: 'INVALID',
  };
  dataMap: {
    [key in CreditInstallmentChequeErrorTypes]: {
      title: string;
      imageId?: string;
      firstDesc?: string;
      descriptionHtml?: string;
    };
  } = {
    NO_SCORE: {
      title: 'شما دارای چک برگشتی یا اقساط معوق هستید.',
      descriptionHtml: 'لطفا پس از برطرف کردن این مشکل، برای ادامه فرآیند دریافت وام مجدد تلاش کنید.',
    },
    INVALID: {
      title: 'شناسۀ چک را اصلاح کنید',
      descriptionHtml: 'شناسۀ 16 رقمی چک را بازبینی و اصلاح کنید.',
    },
  };

  selectedChequeDeliveryMethod = signal<ChequeStepDeliveryMethod | undefined>(undefined);
  selectedDeliveryCityId = signal<number | undefined>(undefined);
  chequeStepDeliveryReserveInfo = signal<ChequeStepDeliveryReserveInfo | undefined>(undefined);
  selectedCityDeliveryMethods = signal<ChequeStepDeliveryMethod[]>([]);

  bottomSheetService = inject(NgxBottomSheetService);
  cacheService = inject(CreditCacheService);
  creditApiService = inject(CreditApiService);
  messageService = inject(MessageService);

  resetDeliveryInfo() {
    this.selectedDeliveryCityId.set(undefined);
    this.selectedChequeDeliveryMethod.set(undefined);
    this.chequeStepDeliveryReserveInfo.set(undefined);
  }

  setDeliveryPickupAddress(pickupAddress?: SelectedAddressModel) {
    this.chequeStepDeliveryReserveInfo.update((info) => ({ ...info!, pickupAddress: pickupAddress }));
  }

  setDeliveryDateAndTime(dateTime?: { selectedDate: DeliveryDate; selectedTime: TimeSlot }) {
    this.chequeStepDeliveryReserveInfo.update((info) => ({
      ...info!,
      selectedDate: dateTime?.selectedDate,
      selectedTime: dateTime?.selectedTime,
    }));
  }

  setDeliverySelectedProvider(selectedProvider: DeliveryProvider) {
    this.chequeStepDeliveryReserveInfo.update((info) => ({ ...info!, selectedProvider: selectedProvider }));
  }

  setData(changedFields: CreditChequeStepInterface) {
    this.data = Object.assign(this.data, changedFields);
  }

  getIbanInfo(iban: string): Observable<any> {
    return new Observable((observer) => {
      const CACHE_TAG = 'CREDIT_CHEQUE_STEP_IBAN_DATA_' + iban;
      if (this.cacheService.has(CACHE_TAG)) {
        observer.next(this.cacheService.get(CACHE_TAG));
        observer.complete();
      } else {
        this.creditApiService.getIbanInfo(iban).subscribe({
          next: (response) => {
            this.cacheService.put(CACHE_TAG, response);
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            if (error?.result?.status === 10045) {
              const invalidIbans = this.invalidIbans.getValue();
              invalidIbans.push(iban);
              this.invalidIbans.next(invalidIbans);
            }
            observer.error(error);
          },
        });
      }
    });
  }

  selectStepFlow(stepFlow: StepFlow): void {
    this.selectedStepFlow = stepFlow;
    this.setData({
      chequeVersion: stepFlow.type,
    });
  }

  handleError(error: any): void {
    if (!error) {
      return;
    }
    if (error.result && error.result.status) {
      const errorType = this.errorTypeMap[error.result.status];
      if (errorType) {
        const errorData = this.dataMap[errorType];
        this.openDialog(errorData);
        return;
      }
    } else if (error.title) {
      this.openDialog(error);
      return;
    }
    this.messageService.showErrorOfErrorResponse(error);
  }

  openDialog(errorData: any) {
    this.bottomSheetService.openBottomSheet(
      CreditChequeStepErrorDialogComponent,
      {
        title: errorData.title,
        firstDesc: errorData.firstDesc,
        descriptionHtml: errorData.descriptionHtml,
        reasons: errorData.reasons,
      },
      {
        noPadding: true,
      },
    );
  }
}
