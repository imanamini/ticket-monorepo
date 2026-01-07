import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillTypeModel } from '../../data-access/models/bill-type.model';
import {
  DailyFintechRecommendationListComponent,
  RECOMMENDATION_TYPES,
  RecommendationData,
} from '@client-monorepo/daily-fintech/recommendation';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { BILL_NUMERIC_PAY_TYPES } from '../../data-access/models/bill-pay-types.enum';
import { BillValidationService } from '../../data-access/services/bill-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BillApiService } from '@client-monorepo/applets/bill';
import { MessageService } from '@client-monorepo/common/utilities';
import { BillTypePickerComponent } from '../bill-type-picker-bottom-sheet/bill-type-picker.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bill-applet-bill-telephone-validate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    DailyFintechRecommendationListComponent,
    NgxButtonComponent,
  ],
  templateUrl: './bill-telephone-validate.component.html',
  styleUrl: './bill-telephone-validate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillTelephoneValidateComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private billValidationService = inject(BillValidationService);
  private billApiService = inject(BillApiService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private formBuilder = inject(UntypedFormBuilder);
  destroyRef = inject(DestroyRef);

  billTypeModel = computed<BillTypeModel | null>(() => this.billValidationService.billTypeModelState());
  billType = computed<string>(() => this.billValidationService.billTypeName());

  isSubmitting = signal(false);
  billInquiryId = signal<number | null>(null);
  billInquiryForm!: UntypedFormGroup;

  protected readonly RECOMMENDATION_TYPES = RECOMMENDATION_TYPES;

  constructor() {
    this.billInquiryId.set(this.route.snapshot.queryParams['id']);
    this.billInquiryForm = this.formBuilder.group({
      cellNumber: ['', [Validators.required, Validators.minLength(8)]],
    });

    if (this.billInquiryId()) {
      this.billInquiryForm.controls['cellNumber'].setValue(this.billInquiryId());
      if (this.billValidationService.isFastInquiry()) {
        this.confirmNavigation();
      }
    }
  }

  confirmNavigation(): void {
    const cellNumber = this.billInquiryForm.controls['cellNumber'].value;
    this.billValidationApi(cellNumber);
  }

  recommendationItemClicked(data: RecommendationData) {
    if (this.isSubmitting()) {
      return;
    }
    this.billInquiryForm.controls['cellNumber'].setValue(data.id);
    this.billValidationApi(data.id);
  }

  billValidationApi(cellNumber: string) {
    this.isSubmitting.set(true);
    const param: object = {
      inquiryId: cellNumber,
      type: this.billTypeModel()?.type,
      payMethod: BILL_NUMERIC_PAY_TYPES.INQUIRY_ID,
    };
    this.billApiService
      .validateBill(param)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          const finalTerm = result.billInfos.find((billInfo) => billInfo.termType === 1);
          const midTerm = result.billInfos.find((billInfo) => billInfo.termType === 0);

          const data = {
            result: result.result,
            midTerm: midTerm,
            finalTerm: finalTerm,
          };
          this.bottomSheetService.openBottomSheet(BillTypePickerComponent, {
            data: data,
            number: cellNumber,
          });

          const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
            const billInfo = this.bottomSheetService.outputData()?.billItem;
            if (billInfo) {
              if (billInfo.amount === 0) {
                this.messageService.showErrorMessage('گزینه انتخاب شده قابل پرداخت نیست');
                return;
              }
              this.billValidationService.setBillInfoData(billInfo);
              this.router.navigate(['bill', 'confirm']).then();
            }
            bottomSheetSubscriber.unsubscribe();
          });

          this.isSubmitting.set(false);
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
          this.isSubmitting.set(false);
        },
      });
  }
}
