import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { UiDialogCBnplVoucherComponent } from '../../../../../../../ui/ui-components/ui-dialogs/ui-dialog-c-bnpl-voucher/ui-dialog-c-bnpl-voucher.component';
import moment from 'jalali-moment';
import { CBnplVoucherTemplateData } from '../../../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-voucher-data';
import { DialogBottomSheetService } from '../../../../../../../core/services/dialog-bottom-sheet.service';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-c-bnpl-vouchers',
  templateUrl: './c-bnpl-vouchers.component.html',
  styleUrls: ['./c-bnpl-vouchers.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, NgFor, UiIconDirective],
})
export class CBnplVouchersComponent implements OnInit {
  @ViewChild('vouchers') elementView: ElementRef;

  vouchersHeight: number;
  isVisibleShowMoreBtn = false;
  isVouchersExpanded = true;
  @Input() vouchers: CBnplVoucherTemplateData[];
  validVouchers: CBnplVoucherTemplateData[] = [];
  screenHeight: number;
  screenWidth: number;
  showSection = false;
  screenDeviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  constructor(
    private dialogBottomSheet: DialogBottomSheetService,
    @Inject(PLATFORM_ID) public platformId: string,
    private cdr: ChangeDetectorRef,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.getScreenSize();
      this.showSection = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (this.platformId !== 'server') {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      this.screenDeviceType = this.calculateDeviceScreenType();
    }
  }

  calculateDeviceScreenType(): 'mobile' | 'tablet' | 'desktop' {
    if (this.screenWidth < 744) {
      return 'mobile';
    } else if (this.screenWidth >= 744 && this.screenWidth <= 1280) {
      return 'tablet';
    } else if (this.screenWidth > 1280) {
      return 'desktop';
    }
  }

  ngOnInit(): void {
    const nowTime = moment(new Date()).format('YYYY/MM/DD');
    this.vouchers.forEach((voucher, index) => {
      if (voucher.expirationDate && !moment.from(voucher.expirationDate, 'fa').isBefore(nowTime)) {
        this.validVouchers.push(voucher);
      }
    });
  }

  ngAfterViewInit() {
    if (this.elementView) {
      this.vouchersHeight = this.elementView.nativeElement.offsetHeight;
      switch (this.screenDeviceType) {
        case 'desktop':
          if (this.vouchersHeight > 156) {
            this.isVisibleShowMoreBtn = true;
            this.isVouchersExpanded = false;
          }
          break;
        case 'tablet':
          if (this.vouchersHeight > 328) {
            this.isVisibleShowMoreBtn = true;
            this.isVouchersExpanded = false;
          }
          break;
        case 'mobile':
          if (this.vouchersHeight > 328) {
            this.isVisibleShowMoreBtn = true;
            this.isVouchersExpanded = false;
          }
          break;
      }
    }
    this.cdr.detectChanges();
  }

  onPreviewVoucher(voucher: CBnplVoucherTemplateData) {
    this.dialogBottomSheet.open(UiDialogCBnplVoucherComponent, {
      width: '376px',
      templateData: voucher,
    });
  }

  onToggleShowMore() {
    this.isVouchersExpanded = !this.isVouchersExpanded;
  }
}
