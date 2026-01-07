import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PromotionServicesModal } from '../../../../api/clients/models/templates/credit-campaign/credit-campaign-template';
import { ApiFile } from '../../../../api/clients/models/common/api-file';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-content-promotion',
  templateUrl: './ui-dialog-content-promotion.component.html',
  styleUrls: ['./ui-dialog-content-promotion.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, NgStyle, NgxIcon],
})
export class UiDialogContentPromotionComponent {
  templateData: any = {};

  promotionServices!: PromotionServicesModal;

  titleIcon = '';

  modalBannerDesktop: ApiFile;

  modalBannerMobile: ApiFile;

  bannerLink: string;

  constructor(
    private ref: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      templateData: any;
      promotionServices: PromotionServicesModal;
      titleIcon: string;
      modalBannerDesktop: ApiFile;
      modalBannerMobile: ApiFile;
      bannerLink: string;
      width: number;
      height: number;
    },
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public bottomSheetData: {
      templateData: any;
      promotionServices: PromotionServicesModal;
      titleIcon: string;
      modalBannerDesktop: ApiFile;
      modalBannerMobile: ApiFile;
      bannerLink: string;
      width: number;
      height: number;
    },
  ) {
    this.templateData = data.templateData ? data.templateData : bottomSheetData.templateData;
    this.promotionServices = data.promotionServices ? data.promotionServices : bottomSheetData.promotionServices;
    this.titleIcon = data.titleIcon ? data.titleIcon : bottomSheetData.titleIcon;
    this.modalBannerDesktop = data.modalBannerDesktop ? data.modalBannerDesktop : bottomSheetData.modalBannerDesktop;
    this.modalBannerMobile = data.modalBannerMobile ? data.modalBannerMobile : bottomSheetData.modalBannerMobile;
    this.bannerLink = data.bannerLink ? data.bannerLink : bottomSheetData.bannerLink;
  }

  closeDialog(): void {
    this.ref.close(false);
  }
}
