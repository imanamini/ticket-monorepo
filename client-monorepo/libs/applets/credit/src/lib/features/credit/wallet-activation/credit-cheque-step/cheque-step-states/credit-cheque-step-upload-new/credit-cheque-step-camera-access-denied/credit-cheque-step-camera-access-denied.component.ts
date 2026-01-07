import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { CreditDeviceService } from '../../../../../data-access/services/credit-device.service';
import { CreditCameraAccessGuidBottomSheetComponent } from '../../../../../components/credit-camera-access-guid-bottom-sheet/credit-camera-access-guid-bottom-sheet.component';

@Component({
  selector: 'app-credit-cheque-step-camera-access-denied',
  templateUrl: './credit-cheque-step-camera-access-denied.component.html',
  styleUrls: ['./credit-cheque-step-camera-access-denied.component.scss'],
  imports: [NgxStatusResultModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepCameraAccessDeniedComponent implements OnInit {
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
      ? 'با استفاده از راهنمای زیر، می‌توانید مشکل دسترسی دوربین را برطرف کنید.'
      : 'برای فعال کردن دوربین، وارد تنظیمات مرورگر شوید و دسترسی دوربین را برای دیجی‌پی فعال کنید.',
  );
  buttons = computed<Buttons[]>(() => [
    {
      label: this.hasSolution() ? 'راهنما' : 'متوجه شدم',
      style: 'fill',
      id: 'creditChequeCameraAccessDeniedButton',
      mode: 'form',
      fullWidth: true,
    },
  ]);

  close = output<void>();

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
      this.bottomSheetService.closeBottomSheet();
      setTimeout(() => {
        this.bottomSheetService.openBottomSheet(
          CreditCameraAccessGuidBottomSheetComponent,
          {
            userDeviceType: this.userDeviceType(),
            userAgent: this.userAgent(),
            userOS: this.userOS(),
          },
          { noPadding: true },
        );
      }, 300);
    } else {
      this.close.emit();
    }
  }
}
