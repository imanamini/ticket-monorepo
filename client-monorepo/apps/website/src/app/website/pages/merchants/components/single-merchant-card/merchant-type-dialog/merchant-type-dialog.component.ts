import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { MerchantTypeDialog } from '../../../../../../api/digipay/models/merchants/single-merchant.model';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgFor, NgOptimizedImage } from '@angular/common';
import { SwiperDirective } from '../../../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-merchant-type-dialog',
  templateUrl: './merchant-type-dialog.component.html',
  styleUrls: ['./merchant-type-dialog.component.scss'],
  standalone: true,
  imports: [NgFor, NgOptimizedImage, UiButtonComponent, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MerchantTypeDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  dialogData: MerchantTypeDialog;

  swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  };

  index = 0;

  constructor(private dialogService: DialogBottomSheetService) {
    this.dialogData = this.dialogService.data.typeDialogData;
  }

  ngOnInit(): void {}

  closeDialog() {
    this.dialogService.close();
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }
}
