import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { DeliveryService } from '../../data-access/services/delivery.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { DeliverTypeEnum } from '../../data-access/enums/deliver-type.enum';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-delivery-applet-delivery-setting',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, ReactiveFormsModule, UiFormFieldBuilderModule, NgxButtonComponent],
  templateUrl: './delivery-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliverySettingComponent implements OnInit, OnDestroy {
  deliveryForm!: FormGroup;
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  deliveryService = inject(DeliveryService);
  messageService = inject(MessageService);
  deliveryOptions = signal<any[]>([
    { value: DeliverTypeEnum.POST, title: 'پست' },
    { value: DeliverTypeEnum.COURIER, title: 'پیک' },
  ]);
  trackingCode: string | undefined;
  protected readonly DeliveryTypeEnum = DeliverTypeEnum;
  deliverTimeDateRange?: [number, number];
  destroy$ = new Subject<void>();
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.initDeliverForm();
    this.setDeliverTimeDateRange();
  }

  setDeliverTimeDateRange() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.deliverTimeDateRange = [thirtyDaysAgo.getTime(), today.getTime()];
  }

  initDeliverForm() {
    this.deliveryForm = this.fb.group({
      deliverTime: ['', Validators.required],
      type: [null, Validators.required],
      postTrackingCode: [''],
      courierCellNumber: ['', NgxFormValidator.cellNumberValidator()],
      courierFullName: [''],
      description: ['', [Validators.maxLength(255)]],
    });

    this.onDeliveryTypeChange();
  }

  onDeliveryTypeChange() {
    this.deliveryForm.get('type')?.valueChanges.subscribe((selectedType) => {
      const postTrackingControl = this.deliveryForm.get('postTrackingCode');
      const courierCellNumberControl = this.deliveryForm.get('courierCellNumber');
      const courierFullNameControl = this.deliveryForm.get('courierFullName');

      if (selectedType === DeliverTypeEnum.POST) {
        postTrackingControl?.setValidators([Validators.required]);
        courierCellNumberControl?.clearValidators();
        courierFullNameControl?.clearValidators();
      } else {
        postTrackingControl?.clearValidators();
        courierCellNumberControl?.setValidators([Validators.required, NgxFormValidator.cellNumberValidator()]);
        courierFullNameControl?.setValidators([Validators.required]);
      }

      postTrackingControl?.updateValueAndValidity();
      courierCellNumberControl?.updateValueAndValidity();
      courierFullNameControl?.updateValueAndValidity();
    });
  }

  submitDeliveryCode(form: FormGroup) {
    const trackingCode = this.route.snapshot.paramMap.get('trackingCode');
    const deliveryData = {
      deliverTime: form.value['deliverTime'],
      description: form.value['description'],
      type: this.deliveryForm.controls['type'].value,
      ...(form.value['type'] === DeliverTypeEnum.POST
        ? { postTrackingCode: form.value['postTrackingCode'] }
        : {
            courierCellNumber: form.value['courierCellNumber'],
            courierFullName: form.value['courierFullName'],
          }),
    };

    this.deliveryService
      .setDeliverySetting(trackingCode, deliveryData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.messageService.showSuccessMessage('تنظیمات ارسال با موفقیت ثبت شد.');
          this.router.navigate(['/home']).then();
        },
        error: (e) => {
          this.messageService.showErrorOfErrorResponse('تنظیمات ارسال با ناموفق بود.', e);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
