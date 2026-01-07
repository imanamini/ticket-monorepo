import { Component, inject, OnInit, signal } from '@angular/core';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { HouseIncidentProductCardModel } from '../../data-access/models/house-incident-product-card.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';
import { InsIconComponent } from '../../../../../vehicle/components/ins-icon/ins-icon.component';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { PolicyUserInfoModel } from '../../../complete-journey/model/policy-user-info.model';
import { HouseIncidentsActionService } from '../../../../data-access/services/house-incidents-action.service';
import { NgxAlert } from '@digipay/ngx-alert';
import { InsButtonModeEnum } from '../../../../../../data-access/enums/ins-button-mode.enum';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { HouseIncidentsApiService } from '../../../../data-access/services/house-incidents-api.service';
import { FaqCategoryTypeEnum } from '../../../../../../data-access/enums/faq-category-type.enum';
import { FaqService } from '../../../../../../data-access/services/faq.service';

@Component({
  selector: 'order-detail-bottom-sheet',
  standalone: true,
  imports: [
    InsButtonComponent,
    PipesModule,
    InsIconComponent,
    NgxAlert,
    NgxButtonComponent,
    NgxIcon
  ],
  templateUrl: './order-detail-bottom-sheet.component.html',
  styleUrl: './order-detail-bottom-sheet.component.scss'
})
export class OrderDetailBottomSheetComponent implements OnInit {
  orderDetail = signal<PolicyUserInfoModel>(null);
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;

  private bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  private bottomSheetService = inject(BottomSheetService);
  private houseIncidentsActionService = inject(HouseIncidentsActionService);
  private houseIncidentsApiService = inject(HouseIncidentsApiService);
  private faqService = inject(FaqService);

  ngOnInit(): void {
    this.orderDetail.set(this.bottomSheetData.data.orderDetail);
  }

  confirmOrder(): void {
    this.bottomSheetService.closeCurrentBottomSheet({goToPayment: true});
  }

  openVoucherBottomSheet(): void {
    this.houseIncidentsActionService.openVoucherBottomSheet(this.orderDetail());
  }

  deleteVoucher(): void {
    this.houseIncidentsApiService.removeVoucher(this.orderDetail().id).subscribe({
      next: result => {
        if (result.success) {
          this.houseIncidentsApiService.getPolicyUserInfo(this.orderDetail().id).subscribe({
            next: result => {
              this.orderDetail.set(result.result);
            }
          });
        }
      }
    });
  }

  public openConditionTerms(): void {
    this.bottomSheetService.closeCurrentBottomSheet();
    setTimeout(() => this.faqService.open(FaqCategoryTypeEnum.HOUSE_INCIDENTS), 500);
    setTimeout(() => this.faqService.open(FaqCategoryTypeEnum.HOUSE_INCIDENTS), 500);
  }
}
