import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { CreditDeviceService } from '../../../../data-access/services/credit-device.service';
import { CreditCameraAccessGuidBottomSheetComponent } from '../../../../components/credit-camera-access-guid-bottom-sheet/credit-camera-access-guid-bottom-sheet.component';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-generate-digital-signature-permission-failed',
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  templateUrl: './credit-generate-digital-signature-permission-failed.component.html',
  styleUrl: './credit-generate-digital-signature-permission-failed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignaturePermissionFailedComponent implements OnInit {
  userAgent = signal<'hybrid' | 'safari' | 'chrome' | 'firefox' | null>(null);
  userOS = signal<'ios' | 'android' | null>(null);
  userDeviceType = signal<'mobile' | 'desktop'>('mobile');

  hasSolution = computed(() => {
    if (!this.userAgent()) {
      return false;
    }
    if (this.userOS() === 'ios') {
      return true;
    }
    return ['hybrid', 'safari', 'chrome'].includes(this.userAgent()!);
  });
  description = computed(() =>
    this.hasSolution()
      ? 'با استفاده از راهنمای زیر، می‌توانید مشکل دسترسی دوربین و میکروفون را در مرورگرهای Google Chrome و Safari برطرف کنید.'
      : 'برای رفع مشکل دسترسی، به تنظیمات مرورگر بروید و دسترسی دوربین و میکروفون را برای دیجی‌پی فعال کنید.',
  );
  buttonLabel = computed<string>(() => (this.hasSolution() ? 'راهنمای دسترسی' : 'متوجه شدم'));
  buttons = computed<Buttons[]>(() => [
    {
      id: 'digitalSignaturePermissionFailedButton',
      style: 'fill',
      mode: 'form',
      fullWidth: true,
      label: this.buttonLabel(),
    },
  ]);
  back = output();

  private bottomSheetService = inject(NgxBottomSheetService);
  private ngxHybridService = inject(NgxHybridService);
  private creditDeviceService = inject(CreditDeviceService);

  ngOnInit() {
    this.setDeviceInfo();
  }
  setDeviceInfo() {
    this.userDeviceType.set(this.creditDeviceService.isMobileOrTablet() ? 'mobile' : 'desktop');

    if (this.creditDeviceService.isAwfulDevice()) {
      return;
    }

    const browserName = this.creditDeviceService.getBrowserName().toLowerCase();
    if (browserName === 'chrome' || browserName === 'safari' || browserName === 'firefox') {
      this.userAgent.set(browserName);
    }
    if (this.ngxHybridService.isHybrid()) {
      this.userAgent.set('hybrid');
    }
    const osName = this.creditDeviceService.getOsName().toLowerCase();
    if (osName === 'ios' || osName === 'android') {
      this.userOS.set(osName);
    }
  }
  openGuidBottomSheet() {
    if (this.hasSolution()) {
      this.bottomSheetService.openBottomSheet(
        CreditCameraAccessGuidBottomSheetComponent,
        {
          userDeviceType: this.userDeviceType(),
          userAgent: this.userAgent(),
          userOS: this.userOS(),
        },
        { noPadding: true },
      );
    } else {
      this.back.emit();
    }
  }
}
