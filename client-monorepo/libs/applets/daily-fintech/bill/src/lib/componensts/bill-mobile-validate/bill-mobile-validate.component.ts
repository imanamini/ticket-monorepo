import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { BillTypeModel } from '../../data-access/models/bill-type.model';
import {
  DailyFintechRecommendationListComponent,
  RECOMMENDATION_TYPES,
  RecommendationData,
} from '@client-monorepo/daily-fintech/recommendation';
import { BillApiService } from '@client-monorepo/applets/bill';
import { BillValidationService } from '../../data-access/services/bill-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BillTypePickerComponent } from '../bill-type-picker-bottom-sheet/bill-type-picker.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'bill-applet-bill-mobile-validate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    DailyFintechRecommendationListComponent,
    NgxButtonComponent,
  ],
  templateUrl: './bill-mobile-validate.component.html',
  styleUrl: './bill-mobile-validate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillMobileValidateComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(UntypedFormBuilder);
  private billValidationService = inject(BillValidationService);
  private billApiService = inject(BillApiService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private messageService = inject(MessageService);

  isSubmitting = signal(false);
  billInquiryId = signal('');

  billTypeModel = computed<BillTypeModel | null>(() => this.billValidationService.billTypeModelState());
  billType = computed<string>(() => this.billValidationService.billTypeName());

  billInquiryForm!: UntypedFormGroup;

  protected readonly RECOMMENDATION_TYPES = RECOMMENDATION_TYPES;

  constructor() {
    this.billInquiryId.set(this.route.snapshot.queryParams['id']);
    this.billInquiryForm = this.fb.group({
      cellNumber: ['', [Validators.required, NgxFormValidator.cellNumberValidator()]],
    });
    if (this.billInquiryId()) {
      this.billInquiryForm.controls['cellNumber'].setValue(this.billInquiryId());
      if (this.billValidationService.isFastInquiry()) {
        this.confirmNavigation();
      }
    }
  }

  private processApiResponse(number: string, operator: number): void {
    this.isSubmitting.set(true);
    this.billApiService.getCellNumberInquiry(number, operator).subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        if (!result.midTerm) {
          this.billValidationService.setBillInfoData(result.finalTerm);
          this.router.navigate(['bill', 'confirm']).then();
          return;
        }
        this.openBottomSheetWithResult(result, number);
      },
      error: (error: any) => {
        this.isSubmitting.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  private openBottomSheetWithResult(result: any, number: string): void {
    this.isSubmitting.set(false);
    this.bottomSheetService.openBottomSheet(BillTypePickerComponent, {
      data: result,
      number: number,
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
  }

  private getOperator(type: number): number {
    return type === 12 ? 2 : 1;
  }

  confirmNavigation(): void {
    const number = this.billInquiryForm.controls['cellNumber'].value;
    const operator = this.getOperator(this.billTypeModel()!.type);
    this.processApiResponse(number, operator);
  }

  recommendationItemClick(data: RecommendationData): void {
    if (this.isSubmitting()) {
      return;
    }
    this.billInquiryForm.controls['cellNumber'].setValue(data.id);
    const operator = this.getOperator(data.type);
    this.processApiResponse(data.id, operator);
  }
}
