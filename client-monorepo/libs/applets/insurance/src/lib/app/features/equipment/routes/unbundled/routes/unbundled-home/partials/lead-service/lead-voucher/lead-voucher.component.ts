import { Component, DestroyRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { currencyFormat } from '@digipay/strings';
import { Subscription } from 'rxjs';
import { HintComponent, HintOptions } from '../../../../../../../../../components/hint/hint.component';
import { LeadApiService } from '../../../../../../../api/services/lead/lead-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgIf } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import {
  InsurtechCollectionImageCdnComponent
} from '../../../../../../../../../components/insurtech-collection-image-cdn/insurtech-collection-image-cdn.component';
import {
  UiDetailListComponent
} from '../../../../../../../../../components/ui-detail-list/ui-detail-list.component';
import { UiButtonComponent } from '../../../../../../../../../components/ui-button/ui-button/ui-button.component';
import { LeadModel } from '../../../../../../../api/models/lead/lead.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lead-voucher',
  templateUrl: './lead-voucher.component.html',
  styleUrls: ['./lead-voucher.component.scss'],
  imports: [
    PipesModule,
    UiFormFieldBuilderModule,
    FormsModule,
    InsurtechCollectionImageCdnComponent,
    UiDetailListComponent,
    UiButtonComponent,
    HintComponent
  ],
  standalone: true
})
export class LeadVoucherComponent implements OnInit {
  mLeadInfo: LeadModel;
  wageDiscountPercent: number;
  @Output()
  pay = new EventEmitter();
  @Input()
  isLoading: boolean;

  @Input()
  set leadInfo(value: LeadModel) {
    this.mLeadInfo = value;
    if (this.mLeadInfo.purchaseCampaignDetail) {
      this.voucherCode = this.mLeadInfo.purchaseCampaignDetail.discountCode;
    }
    this.setWageAndDisplayDifferent();
    this.calculateWageDiscountPercent();
  }

  get leadInfo(): LeadModel {
    return this.mLeadInfo;
  }

  hintOptions: HintOptions = {
    type: 'warning',
    message: '',
    icon: 'orange-info'
  };
  voucherHintOption: HintOptions;
  itemList: { title: string, value: string }[] = [];
  voucherCode: string;
  areWageAndDisplayDifferent = signal<boolean>(false);
  private leadService = inject(LeadApiService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.setWageAndDisplayDifferent();
    this.hintOptions.message = `زمان باقی مانده : ${this.leadInfo.orderDeadLineDays} روز`;
    this.fillListItem();

    if (this.leadInfo.isValidDiscountCode) {
      this.voucherHintOption = {
        type: 'success',
        message: 'کد تخفیف اعمال شد.',
        icon: 'green-tick',
        actions: [
          {
            title: 'حذف',
            id: 'remove'
          }
        ]
      };
    } else {
      this.voucherHintOption = {
        type: 'warning',
        message: 'کد وارد شده معتبر نیست!',
        icon: 'orange-info',
        actions: [
          {
            title: 'ویرایش',
            id: 'edit'
          }
        ]
      };
    }
  }

  payRequest(): void {
    this.pay.emit();
  }

  setWageAndDisplayDifferent(): void {
    this.areWageAndDisplayDifferent.set(this.leadInfo.displayWageAmount !== 0 && this.leadInfo.wageAmount !== this.leadInfo.displayWageAmount);
  }

  calculateWageDiscountPercent(): void {
    this.wageDiscountPercent = this.areWageAndDisplayDifferent() ?
      Math.round((Number(this.leadInfo.displayWageAmount) - Number(this.leadInfo.wageAmount))
        / this.leadInfo.displayWageAmount * 100) : 0;
  }

  actionClick(id): void {
    if (id === 'edit') {
      this.leadInfo.discountCode = null;
    }
    if (id === 'remove') {
      this.removeVoucherCode();
    }
  }

  fillListItem(): void {
    this.itemList = [
      {
        title: 'میزان حق بیمه',
        value: `${this.leadInfo.wagePercent}٪ ارزش مالی کالا`
      },
      {
        title: 'اعتبار بیمه نامه',
        value: `${this.leadInfo.durationValue} ${this.leadInfo.durationUnit} از تاریخ صدور`
      },
      {
        title: 'میزان تخفیف',
        value: currencyFormat(this.leadInfo.discountAmount) + ' تومان '
      }
    ];
  }

  removeVoucherCode(): void {
    const code = this.route.snapshot.queryParams.code;
    this.leadService.removeDiscount(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.messageService.showApiSuccess(res);
        this.leadInfo.discountCode = '';
        this.leadInfo.discountAmount = 0;
        this.leadInfo.payableAmount = res.data.payableAmount / 10;
        this.leadInfo.taxAmount = res.data.taxAmount / 10;
        this.fillListItem();
      }, err => this.messageService.showErrorIfExists(err));
  }

  addVoucherCode(): void {
    const code = this.route.snapshot.queryParams.code;
    this.leadService.addDiscount(code, this.voucherCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        if (res.data.isValid) {
          this.leadInfo.discountAmount = res.data.discountAmount / 10;
          this.leadInfo.payableAmount = res.data.payableAmount / 10;
          this.leadInfo.taxAmount = res.data.taxAmount / 10;
          this.leadInfo.discountCode = this.voucherCode;
          this.leadInfo.isValidDiscountCode = true;
          this.fillListItem();
        } else {
          this.messageService.showErrorMessage(res.data.invalidMessage);
        }
      }, err => this.messageService.showErrorIfExists(err));
  }
}
