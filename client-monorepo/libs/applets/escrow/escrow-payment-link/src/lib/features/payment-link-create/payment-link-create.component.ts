import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { PaymentLinkDescriptionConfig } from '../../data-access/model/payment-link-description.model';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PaymentLinkCreateConfirmationComponent } from '../../components/payment-link-create-confirmation/payment-link-create-confirmation.component';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription, switchMap, tap } from 'rxjs';
import { MessageService } from '@client-monorepo/common/utilities';
import { PaymentLinkApiService } from '../../data-access/api/payment-link-api.service';
import { PaymentLinkRequestInfo } from '../../data-access/model/payment-link-create.model';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { AdSummeryDetailComponent } from '../../components/ad-summery-detail/ad-summery-detail.component';

@Component({
  selector: 'escrow-payment-link-create-link',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    NgxButtonComponent,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AdSummeryDetailComponent,
  ],
  templateUrl: './payment-link-create.component.html',
  styleUrl: './payment-link-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaymentLinkApiService],
})
export class PaymentLinkCreateComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private bottomSheetService = inject(NgxBottomSheetService);
  private readonly message = inject(MessageService);
  private readonly api = inject(PaymentLinkApiService);

  private route = inject(ActivatedRoute);

  public descriptionConfig: PaymentLinkDescriptionConfig = {
    descriptionEnum: ['تمامی مبالغ لینک های ساخته شده به حساب تایید شده کسب وکار بالا تسویه خواهد شد.'],
    headerTitle: '',
  };
  showDescription = signal<boolean>(false);
  descriptionsAlreadyRead = signal<boolean>(false);
  loading = signal<boolean>(false);
  adData!: PaymentLinkRequestInfo;
  routeSubscription!: Subscription;

  requestId = '';
  public form = this.fb.group({
    requestId: [this.requestId],
    amount: [null, [Validators.required, Validators.min(10_000)]],
    description: [null],
  });

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.loading.set(true);
    this.routeSubscription = this.route.queryParams
      .pipe(
        map((param) => {
          if (!param['requestId']) {
            this.message.showErrorMessage('مشکلی پیش اماده دوباره تلاش کنید');
            return '';
          }
          return param['requestId'];
        }),
        tap((param) => {
          this.requestId = param;
          this.form.patchValue({ requestId: this.requestId });
        }),
        switchMap((requestId) => this.getRequestInfo(requestId)),
      )
      .subscribe({
        next: (data) => {
          this.adData = data;
          this.loading.set(false);
        },
        error: (error) => {
          this.message.showErrorOfErrorResponse(error);
          this.loading.set(false);
        },
      });
  }

  private getRequestInfo(requestId: any) {
    return this.api.requestInfo(requestId);
  }

  hideDescription() {
    this.showDescription.set(true);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.openConfirmationBottomSheet();
  }

  private openConfirmationBottomSheet() {
    if (this.bottomSheetService) {
      this.bottomSheetService.openBottomSheet(PaymentLinkCreateConfirmationComponent, {
        paymentLink: this.form.value,
        requestInfo: this.adData,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
