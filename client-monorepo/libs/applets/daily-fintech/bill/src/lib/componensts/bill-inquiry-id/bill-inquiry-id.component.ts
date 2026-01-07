import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import {
  DailyFintechRecommendationListComponent,
  RECOMMENDATION_TYPES,
  RecommendationData,
} from '@client-monorepo/daily-fintech/recommendation';
import { BillTypeModel } from '../../data-access/models/bill-type.model';
import { BILL_NUMERIC_PAY_TYPES } from '../../data-access/models/bill-pay-types.enum';
import { BillValidationService } from '../../data-access/services/bill-validation.service';
import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'bill-applet-inquiry-id',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    DailyFintechRecommendationListComponent,
    NgxButtonComponent,
  ],
  templateUrl: './bill-inquiry-id.component.html',
  styleUrl: './bill-inquiry-id.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillInquiryIdComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(UntypedFormBuilder);
  private billValidationService = inject(BillValidationService);

  billInquiryId = signal('');
  billInquiryForm = signal<UntypedFormGroup>({} as UntypedFormGroup);
  inquiryIdMinLength = signal<number>(6);
  isSubmitting = signal(false);
  recommendationType = signal<RECOMMENDATION_TYPES>(2);
  inquiryIdMaxLength = signal<number>(13);
  errorMessageMapper = signal({
    inquiryId: 'شناسه قبض وارد شده نامعتبر است',
  });

  description = computed(() => {
    return this.billTypeModel()?.type === 6 ? 'شماره اشتراک' : 'شناسه قبض';
  });
  billTypeModel = computed<BillTypeModel | null>(() => this.billValidationService.billTypeModelState());
  billType = computed<string>(() => this.billValidationService.billTypeName());

  ngOnInit() {
    this.initPage();
  }

  initPage(): void {
    this.billInquiryId = this.route.snapshot.queryParams['id'];
    this.billInquiryForm.set(
      this.fb.group({
        inquiryId: [
          '',
          [Validators.required, Validators.minLength(this.inquiryIdMinLength()), Validators.maxLength(this.inquiryIdMaxLength())],
        ],
      }),
    );
    this.recommendationType.set(RECOMMENDATION_TYPES.BILL);
    if (this.billInquiryId) {
      this.billInquiryForm().controls['inquiryId'].setValue(this.billInquiryId);
      if (this.billValidationService.isFastInquiry()) {
        this.confirmNavigation();
      }
    }
  }

  confirmNavigation(): void {
    const inquiryId = this.billInquiryForm().controls['inquiryId'].value;
    this.billValidationApi(inquiryId);
  }

  recommendationItemClicked(data: RecommendationData) {
    this.billInquiryForm().controls['inquiryId'].setValue(data.id);
    this.billValidationApi(data.id);
  }

  billValidationApi(inquiryId: string) {
    this.isSubmitting.set(true);
    this.billValidationService
      .billValidationApiNavigateToConfirm(inquiryId, BILL_NUMERIC_PAY_TYPES.INQUIRY_ID)
      .then(() => {
        this.isSubmitting.set(false);
      })
      .catch(() => {
        this.isSubmitting.set(false);
      });
  }
}
