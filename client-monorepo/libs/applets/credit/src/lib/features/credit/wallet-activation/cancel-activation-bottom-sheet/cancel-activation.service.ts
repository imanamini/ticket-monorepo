import { inject, Injectable, signal } from '@angular/core';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CancelActivationMessage } from './cancel-activation-bottom-sheet.model';
import { CancelActivationBottomSheetComponent } from './cancel-activation-bottom-sheet.component';
import { NgxStateService } from '@digipay/ngx-status-result';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { MessageService } from '../../data-access/services/message.service';
import { CancelActivationBottomSheetResult } from '../../data-access/models/credit/activation/cancel-activation/cancel-activation-reasons.response';
import { CreditUrlService } from '../../data-access/utils/url';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CANCEL_ACTIVATION_ACCESS_STATUS } from '../../data-access/models/credit/activation/cancel-activation/cancel-activation-access-status';
import {
  ABOVE_LIMITATION_MESSAGE,
  ABOVE_LIMITATION_MONTHLY_MESSAGE,
  IMPOSSIBLE_MESSAGE,
  POSSIBLE_BY_OPERATION_MESSAGE,
  POSSIBLE_MESSAGE,
} from './cancel-activation-bottom-sheet.data';
import { ACTIVATION_CANCEL_RESPONSE_STATE } from '../../data-access/models/credit/activation/cancel-activation/activation-cancel-response-state';
import { CreditServiceTypeService } from '../../data-access/services/credit-service-type.service';

const NOT_ACCESSIBLE_ERROR = 19905;

@Injectable({
  providedIn: 'root',
})
export class CancelActivationService {
  messageService = inject(MessageService);
  stateService = inject(NgxStateService);
  bottomSheetService = inject(NgxBottomSheetService);
  creditApiService = inject(CreditApiService);
  creditUrlService = inject(CreditUrlService);
  creditServiceTypeService = inject(CreditServiceTypeService);
  router = inject(Router);

  private destroy$ = new Subject<void>();
  private refreshDataRequest$ = new Subject<void>();

  creditId = signal<string>('');
  status = signal<'MESSAGE' | 'GET_REASON' | 'WRITE_REASON' | null>(null);
  message = signal<CancelActivationMessage | null>(null);

  public readonly onRefreshRequested$: Observable<void> = this.refreshDataRequest$.asObservable();

  getData(creditId: string): void {
    this.creditId.set(creditId);

    this.creditApiService
      .getCancelActivationAccess(creditId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleAccessResponse(response.activationArchiveAccess);
        },
        error: (error) => {
          if (error.result.status === NOT_ACCESSIBLE_ERROR) {
            this.showNotAccessibleError();
          } else {
            this.messageService.showErrorOfErrorResponse(error);
          }
        },
      });
  }

  showNotAccessibleError() {
    const serviceTypeName = this.creditServiceTypeService.isBnpl() ? 'اعتبار اقساطی' : 'وام';
    this.stateService.openBottomSheet({
      buttons: [
        {
          id: 'primary',
          fullWidth: true,
          mode: 'form',
          label: 'متوجه شدم',
          style: 'fill',
        },
      ],
      title: 'در این مرحله امکان لغو فرایند وجود ندارد',
      description: `ما در حال فعال‌سازی کارت ${serviceTypeName} شما هستیم و با توجه به اینکه تمام مراحل را طی کرده‌اید دیگر امکان لغو فرایند ثبت‌نام وجود ندارد.`,
      type: 'Status',
      icon: 'error',
    });
  }

  private handleAccessResponse(accessStatus: CANCEL_ACTIVATION_ACCESS_STATUS): void {
    const messageMap = {
      [CANCEL_ACTIVATION_ACCESS_STATUS.IMPOSSIBLE]: IMPOSSIBLE_MESSAGE,
      [CANCEL_ACTIVATION_ACCESS_STATUS.ABOVE_LIMITATION]: ABOVE_LIMITATION_MESSAGE,
      [CANCEL_ACTIVATION_ACCESS_STATUS.ABOVE_LIMITATION_MONTHLY]: ABOVE_LIMITATION_MONTHLY_MESSAGE,
      [CANCEL_ACTIVATION_ACCESS_STATUS.POSSIBLE]: POSSIBLE_MESSAGE,
      [CANCEL_ACTIVATION_ACCESS_STATUS.POSSIBLE_BY_OPERATION]: POSSIBLE_BY_OPERATION_MESSAGE,
    };

    this.status.set('MESSAGE');
    this.message.set(messageMap[accessStatus]);

    if (this.status() === 'MESSAGE' && this.message()) {
      this.onCancelActivationClick(this.message()!);
    }
  }

  private onCancelActivationClick(message: CancelActivationMessage): void {
    this.stateService.openBottomSheet({
      buttons: message.buttons,
      description: message.description,
      icon: message.image,
      title: message.title,
      type: message.image === 'error' ? 'Status' : 'Confirmation',
    });

    this.stateService
      .onClose()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const result = this.stateService.outputData();
        if (result?.clicked === 'CONFIRM') {
          this.openReasonsBottomSheet();
        }
      });
  }

  private openReasonsBottomSheet(): void {
    this.bottomSheetService.openBottomSheet(
      CancelActivationBottomSheetComponent,
      {
        data: {
          creditId: this.creditId(),
        },
      },
      {
        noPadding: true,
      },
    );

    this.bottomSheetService.onClose.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const result: CancelActivationBottomSheetResult = this.bottomSheetService.outputData();
      if (result?.done) {
        this.handleBottomSheetResult(result);
      }
    });
  }

  private handleBottomSheetResult(result: CancelActivationBottomSheetResult): void {
    if (result.activationCancelResponseState === ACTIVATION_CANCEL_RESPONSE_STATE.ARCHIVED) {
      const serviceTypeName = this.creditServiceTypeService.isBnpl() ? 'اعتبار اقساطی' : 'وام';
      this.messageService.showSuccessMessage('فرآیند ثبت نام دریافت ' + serviceTypeName + ' شما لغو شد.');
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve') + `?prevent=back`);
    } else if (result.activationCancelResponseState === ACTIVATION_CANCEL_RESPONSE_STATE.READY_TO_ARCHIVED) {
      // Notify subscribers that data needs to be refreshed
      this.refreshDataRequest$.next();
    }
  }

  // Cleanup method
  public destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
