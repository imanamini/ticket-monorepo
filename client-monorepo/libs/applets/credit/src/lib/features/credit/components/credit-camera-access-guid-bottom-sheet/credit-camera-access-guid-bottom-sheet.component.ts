import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

const deviceCameraAccessPaths: { [key: string]: string } = {
  'hybrid-android': 'Settings > Apps > Digipay > Permissions > Camera > Allow',
  'chrome-android': 'Settings > Site settings > All sites > app.mydigipay.com > Camera > Allow',
  'hybrid-ios': 'Settings > Apps > Digipay > Camera > Allow',
  'chrome-ios': 'Settings > Apps > Chrome > Camera > Allow',
  'safari-ios': 'Settings > Apps > Safari > Camera > Allow',
  'firefox-ios': 'Settings > Apps > Firefox > Camera > Allow',
  'chrome-desktop': 'Settings > Privacy & Security > Site Setting > dpx.mydigipay.com > Camera > Allow',
  'safari-desktop': 'Settings > Website > Camera > Allow',
};

const translateAgent = {
  hybrid: 'دیجی‌پی',
  safari: 'سافاری',
  chrome: 'کروم',
  firefox: 'فایرفاکس',
};

@Component({
  selector: 'app-credit-camera-access-guid-bottom-sheet',
  standalone: true,
  imports: [NgxButtonComponent, NgxTrackableIdDirective, NgxBottomSheetHeaderComponent, NgxCalloutComponent],
  templateUrl: './credit-camera-access-guid-bottom-sheet.component.html',
  styleUrl: './credit-camera-access-guid-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCameraAccessGuidBottomSheetComponent implements OnInit {
  userAgent = signal<'hybrid' | 'safari' | 'chrome' | 'firefox' | null>(null);
  userOS = signal<'ios' | 'android' | null>(null);
  userDeviceType = signal<'mobile' | 'desktop'>('mobile');

  accessPath = computed(() => {
    if (this.userDeviceType() === 'mobile') {
      return deviceCameraAccessPaths[this.userAgent() + '-' + this.userOS()];
    }
    return deviceCameraAccessPaths[this.userAgent() + '-' + this.userDeviceType()];
  });

  translateUserAgent = computed(() => (this.userAgent() ? translateAgent[this.userAgent()!] : ''));
  translateUserDeviceType = computed(() => {
    if (this.userDeviceType() === 'mobile') {
      return this.userOS() === 'ios' ? 'آیفون' : 'اندروید';
    }
    return 'دسکتاپ';
  });

  showNotice = computed(() => {
    if (!this.userAgent()) {
      return false;
    }
    return ['hybrid', 'safari', 'firefox', 'chrome'].includes(this.userAgent()!) && this.userOS() === 'ios';
  });

  private bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    const data = this.bottomSheetService.data();
    if (data) {
      this.userDeviceType.set(data.userDeviceType);
      this.userAgent.set(data.userAgent);
      this.userOS.set(data.userOS);
    }
  }

  onClose(): void {
    this.bottomSheetService.closeBottomSheet();
  }
}
