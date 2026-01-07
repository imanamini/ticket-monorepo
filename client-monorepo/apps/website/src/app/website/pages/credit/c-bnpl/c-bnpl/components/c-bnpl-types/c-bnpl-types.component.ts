import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { CBnplTypesTemplateData } from '../../../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-types-template-data';
import { DialogBottomSheetService } from '../../../../../../../core/services/dialog-bottom-sheet.service';
import { SwiperOptions } from 'swiper/types';
import { UiDialogCBnplDetailsComponent } from '../../../../../../../ui/ui-components/ui-dialogs/ui-dialog-c-bnpl-details/ui-dialog-c-bnpl-details.component';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../../../../../ui/ui-directive/ui-icon.directive';
import { SwiperDirective } from '../../../../../../../ui/ui-directive/swiper.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-c-bnpl-types',
  templateUrl: './c-bnpl-types.component.html',
  styleUrls: ['./c-bnpl-types.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, NgOptimizedImage, NgIf, UiIconDirective, UiButtonComponent, SwiperDirective, NgxIcon],
})
export class CBnplTypesComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  @Input()
  cBnplTypes: CBnplTypesTemplateData[];

  selectedBnplTypeIndex = 0;

  cBnplSwiperConfig: SwiperOptions = {
    slideToClickedSlide: true,
    freeMode: true,
    spaceBetween: 16,
    slidesPerView: 2,
  };

  constructor(private dialogBottomSheet: DialogBottomSheetService) {}

  onSelectBnplType(index: number) {
    this.selectedBnplTypeIndex = index;
  }

  openDialog() {
    this.dialogBottomSheet.open(UiDialogCBnplDetailsComponent, {
      width: '580px',
      templateData: this.cBnplTypes[this.selectedBnplTypeIndex].creditDetails,
    });
  }
}
