import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CancelActivationMessage, CancelActivationMessageAction } from './cancel-activation-bottom-sheet.model';
import { READY_TO_ARCHIVE_MESSAGE } from './cancel-activation-bottom-sheet.data';
import { ACTIVATION_CANCEL_RESPONSE_STATE } from '../../data-access/models/credit/activation/cancel-activation/activation-cancel-response-state';
import { MessageService } from '../../data-access/services/message.service';
import { CancelReasonType } from '../../data-access/models/credit/activation/cancel-activation/cancel-activation-reasons.response';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { SelectionBoxComponent, SelectionBoxConfig } from '../../components/selection-box/selection-box.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CreditServiceTypeService } from '../../data-access/services/credit-service-type.service';

@Component({
  standalone: true,
  selector: 'app-cancel-activation-bottom-sheet',
  templateUrl: './cancel-activation-bottom-sheet.component.html',
  styleUrls: ['./cancel-activation-bottom-sheet.component.scss'],
  imports: [
    SelectionBoxComponent,
    UiFormFieldBuilderModule,
    FormsModule,
    NgxButtonComponent,
    NgxIcon,
    NgxBottomSheetHeaderComponent,
    NgxSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelActivationBottomSheetComponent {
  creditId: string;
  fundProviderCode: number;
  options = signal<SelectionBoxConfig[]>([]);

  selectedOption = signal<SelectionBoxConfig | null>(null);
  description = signal<string>('');
  status = signal<'MESSAGE' | 'GET_REASON' | 'WRITE_REASON' | null>(null);
  message = signal<CancelActivationMessage | null>(null);
  gettingData = signal<boolean | null>(null);
  sendingData!: boolean;
  bottomSheetService = inject(NgxBottomSheetService);
  creditApiService = inject(CreditApiService);
  changeDetectorRef = inject(ChangeDetectorRef);
  messageService = inject(MessageService);
  creditServiceTypeService = inject(CreditServiceTypeService);

  arrowLeftIcon = viewChild<TemplateRef<any>>('arrowLeftIcon');

  constructor() {
    const { data } = this.bottomSheetService.data();
    this.creditId = data.creditId;
    this.fundProviderCode = data.fundProviderCode || 0;
    this.getReasons();
  }

  getReasons() {
    this.gettingData.set(true);
    this.creditApiService.getCancelCreditActivationReasons(this.creditServiceTypeService.getServiceType()).subscribe({
      next: (response) => {
        this.options.set(
          response.cancelReasons.map((item) => {
            return {
              value: item.cancelReasonType,
              label: item.message,
              selected: false,
              checkboxType: +item.cancelReasonType !== CancelReasonType.OTHER,
              template: +item.cancelReasonType === CancelReasonType.OTHER ? this.arrowLeftIcon() : undefined,
            };
          }),
        );
        this.gettingData.set(false);
        this.status.set('GET_REASON');
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onConfirm() {
    this.sendingData = true;
    this.creditApiService
      .cancelCreditActivation(this.fundProviderCode, this.creditId, this.selectedOption()?.value!, this.description())
      .subscribe({
        next: (response) => {
          if (response.activationArchiveResponseState === ACTIVATION_CANCEL_RESPONSE_STATE.ARCHIVED) {
            this.bottomSheetService.outputData.set({
              done: true,
              activationCancelResponseState: response.activationArchiveResponseState,
            });
            this.close();
            this.sendingData = false;
            this.changeDetectorRef.detectChanges();
            return;
          }
          if (response.activationArchiveResponseState === ACTIVATION_CANCEL_RESPONSE_STATE.READY_TO_ARCHIVED) {
            this.status.set('MESSAGE');
            this.message.set(READY_TO_ARCHIVE_MESSAGE);
            this.sendingData = false;
            this.changeDetectorRef.detectChanges();
          }
          this.bottomSheetService.outputData.set({
            done: true,
            activationCancelResponseState: response.activationArchiveResponseState,
          });
          this.close();
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }

  detachAction(action: string) {
    switch (action) {
      case CancelActivationMessageAction.CLOSE:
        this.close();
        break;
      case CancelActivationMessageAction.READY_TO_ARCHIVE_DONE:
        this.bottomSheetService.outputData.set({
          done: true,
          activationCancelResponseState: ACTIVATION_CANCEL_RESPONSE_STATE.READY_TO_ARCHIVED,
        });
        this.close();
        break;
      case CancelActivationMessageAction.CONFIRM:
        this.getReasons();
        break;
    }
  }

  selectedOptionFn(opt: SelectionBoxConfig) {
    if (+opt.value === CancelReasonType.OTHER) {
      this.selectedOption.set(null);
      this.status.set('WRITE_REASON');
      return;
    }

    this.selectedOption.set(opt);
    this.description.set('');
    this.options.set(
      this.options().map((item) => {
        return { ...item, selected: item.value === opt.value };
      }),
    );
  }
}
