import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DraftModel } from '../../../models/draft.model';
import { DecimalPipe } from '@angular/common';
import { DiscountModalComponent } from '../discount-modal/discount-modal.component';
import { ApplicationFormService } from '../../../services/application-form.service';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { StoreDataForPaymentService } from '../../../services/store-data-for-payment.service';
import { FlokiRoutesEnum } from '../../../enums/floki-routes.enum';
import { QueryParamsEnum } from '../../../enums/query-params.enum';
import { MatDialog } from '@angular/material/dialog';
import { LazyLoadImageDirective } from '../../../common/directives/lazy-load-image.directive';
import { ProductModel } from '../../../models/product.model';
import { BottomSheetService } from '../../../../../data-access/services/bottom-sheet.service';
import { ReferrerService } from '../../../../../data-access/services/referrer.service';
import { BottomSheetBoxComponent } from '../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import { BaseComponent } from '../../../../../components/base/base.component';
import { InsuranceNoticeComponent } from '../../../../../components/insurance-notice/insurance-notice.component';

@Component({
  selector: 'prepayment-modal',
  standalone: true,
  imports: [NgxButtonComponent, DecimalPipe, NgxIcon, LazyLoadImageDirective],
  templateUrl: './prepayment-modal.component.html',
  styleUrl: './prepayment-modal.component.scss',
})
export class PrepaymentModalComponent extends BaseComponent implements OnInit {
  private bottomSheetService = inject(BottomSheetService);
  private bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  private hybridService = inject(NgxHybridServiceService);
  private applicationFormService = inject(ApplicationFormService);
  private referrerService: ReferrerService = inject(ReferrerService);
  private dialog = inject(MatDialog);
  private storeDataForPaymentService = inject(StoreDataForPaymentService);

  draftData = signal<DraftModel>(null);
  product = signal<ProductModel>(null);
  isDisable = signal<boolean>(false);

  public onOpenDiscountModal(): void {
    this.bottomSheetService
      .open(BottomSheetBoxComponent, {
        component: DiscountModalComponent,
        name: 'DiscountBottomSheet',
        data: {
          formId: this.bottomSheetData?.data?.draft?.applicationFormId,
        },
      })
      .afterDismissed()
      .subscribe({
        next: (res) => {
          let draft: DraftModel = this.draftData();
          if (res) {
            draft = res;
          }
          this.bottomSheetService.open(BottomSheetBoxComponent, {
            component: PrepaymentModalComponent,
            name: 'PrepaymentModalComponent',
            data: { draft, product: this.product() },
          });
        },
      });
  }

  ngOnInit(): void {
    this.draftData.set(this.bottomSheetData.data.draft);
    this.product.set(this.bottomSheetData.data.product);
  }

  public sendToPayment(): void {
    this.applicationFormService.prePayment(this.bottomSheetData?.data?.draft?.applicationFormId).subscribe((res) => {
      let popUp: WindowProxy | null;
      if (this.hybridService.isHybrid()) {
        // popUp = window.open(
        //   `${environment.domain_address + environment.base_href}/${FlokiRoutesEnum.Floki}/${FlokiRoutesEnum.Payment}/${FlokiRoutesEnum.GoToPayment}?${QueryParamsEnum.PaymentId}=${res.result.paymentId}&${QueryParamsEnum.UrlGoToPayment}=${encodeURI(res.result.paymentUrl)}&${QueryParamsEnum.ApplicationId}=${res.result.applicationFormId}${this.referrerService?.referrer ? '&' + QueryParamsEnum.Referrer + '=' + this.referrerService?.referrer : ''}`,
        //   '_blank',
        // );
      } else {
        this.storeDataForPaymentService.storeOrderData({
          isHybrid: this.hybridService.isHybrid(),
          referrer: this.referrerService?.referrer,
          appId: this.bottomSheetData?.data?.draft?.applicationFormId,
          paymentId: res.result.paymentId,
        });
        popUp = window.open(res.result.paymentUrl, '_self');
      }

      try {
        popUp.focus();
      } catch (e) {
        window.location.assign(res.result.paymentUrl);
      }
    });
  }

  private removeDiscount(): void {
    this.isDisable.set(true);
    this.applicationFormService.setDiscount(null, this.bottomSheetData?.data?.draft?.applicationFormId).subscribe(
      (res) => {
        this.draftData.set(res.result);
        this.isDisable.set(false);
      },
      () => this.isDisable.set(false),
    );
  }

  confirmRemoveDiscount(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.dialog
      .open(InsuranceNoticeComponent, {
        data: {
          title: 'حذف کد تخفیف',
          text: 'آیا از حذف کد تخفیف مطمئن هستید؟',
          activeButtonText: 'حذف',
          deActiveButtonText: 'انصراف',
        },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (!res) {
            return;
          }
          this.removeDiscount();
        },
      });
  }
}
