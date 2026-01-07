import { Component, DestroyRef, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CouponService } from '../../services/coupon/coupon.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreditPayService } from '../../../shared/services/credit-pay.service';
import { EventManagementApiService } from '../../../api/event-management-api.service';

@Component({
  selector: 'app-coupon-bottom-sheet',
  templateUrl: './coupon-bottom-sheet.component.html',
  standalone: true,
  imports: [
    NgxIcon,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    NgxButtonComponent,
  ]
})
export class CouponBottomSheetComponent implements OnInit {
  // Services
  private fb = inject(FormBuilder);
  private bottomSheet = inject(NgxBottomSheetService);
  private destroyRef = inject(DestroyRef);
  private couponService = inject(CouponService);
  private payService = inject(CreditPayService);
  private eventManagementApiService = inject(EventManagementApiService);

  // Signals
  form = signal<FormGroup | undefined>(undefined);
  submitting = signal(false);
  backendErrorMessage = signal<string>(null);
  clickOnFieldEventIsSent = false;

  couponFieldView = viewChild('couponFieldView', {
    read: ElementRef<HTMLDivElement>
  });

  ngOnInit() {
    this.form.set(this.fb.group({
      couponCode: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-_]*$/)]],
    }));
  }

  get couponCode(): string {
    return this.form().getRawValue()?.couponCode;
  }

  deleteNotAllowedChars(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || window['clipboardData'];
    const pastedText = clipboardData.getData('text');
    const refinedPastedText = this.removeNonEnglish(pastedText);

    event.preventDefault();
    const couponControl = this.form().get('couponCode');
    couponControl.setValue(refinedPastedText);
  }

  private removeNonEnglish(text: string) {
    /**
     * Remove non-English characters and spaces from a string, keeping only:
     * - English letters (a-z, A-Z)
     * - Numbers (0-9)
     * - Hyphens (-)
     * - Underscores (_)
     */
    return text.replace(/[^a-zA-Z0-9\-_]/g, '');
  }

  onSubmit() {
    this.submitting.set(true);
    const couponControl = this.form().get('couponCode');
    this.couponService.ValidateCoupon({
      couponCode: this.couponCode,
      creditId: this.bottomSheet.data().creditId
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: res => {
        this.couponService.updateCoupons(this.bottomSheet.data().creditId, {
          couponCode: this.couponCode,
          amount: res.amount,
          couponAmount: res.couponAmount,
          finalAmount: res.finalAmount,
        });
        this.onSuccessEvent();
        this.submitting.set(false);
        this.bottomSheet.outputData.set(true);
        this.bottomSheet.closeBottomSheet();
      },
      error: err => {
        this.submitting.set(false);
        if (err && err.httpStatus === 401) {
          return this.payService.goToExpiredTokenPage();
        }
        const backendErrorMessage = err?.result?.message || 'خطایی رخ داده است';
        this.onErrorEvent(backendErrorMessage);
        this.backendErrorMessage.set(backendErrorMessage);
        couponControl.setErrors({
          backend: true
        });
        if (this.couponFieldView) {
          setTimeout(() => {
            this.couponFieldView().nativeElement.click();
          }, 100);
        }
      }
    });
  }

  onCancel() {
    this.bottomSheet.closeBottomSheet();
  }

  onSuccessEvent(): void {
    this.eventManagementApiService.sendEvents({
      eventType: 'click',
      breadCrumbs: ['coupon-bottom-sheet'],
      data: {
        target: 'coupon-success-response',
      },
      meta: `code: ${this.couponCode}`,
    });
  }


  onErrorEvent(message: string): void {
    this.eventManagementApiService.sendEvents({
      eventType: 'click',
      breadCrumbs: ['coupon-bottom-sheet'],
      data: {
        target: 'coupon-error-response',
      },
      meta: `code: ${this.couponCode}, message: ${message}`,
    });
  }

  onInputClick(): void {
    if (this.clickOnFieldEventIsSent) {
      return;
    }
    this.clickOnFieldEventIsSent = true;
    this.eventManagementApiService.sendEvents({
      eventType: 'click',
      breadCrumbs: ['coupon-bottom-sheet'],
      data: {
        target: 'coupon-field',
      },
    });
  }
}
