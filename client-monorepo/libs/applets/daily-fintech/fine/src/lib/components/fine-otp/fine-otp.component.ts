import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FillOtpComponent } from '@client-monorepo/common/otp';
import { FineApiService, FineIdentityCheckUser, VehicleType } from '@client-monorepo/daily-fintech/vehicle-data';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'fine-applet-otp',
  standalone: true,
  imports: [CommonModule, FillOtpComponent],
  templateUrl: './fine-otp.component.html',
  styleUrl: './fine-otp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FineOtpComponent {
  fineApiService = inject(FineApiService);
  private destroyRef = inject(DestroyRef);

  sheetData: {
    plateNo: string;
    cellNumber: string;
    nationalCode: string;
  };
  bottomSheetService = inject(NgxBottomSheetService);
  errorMessage = signal<string>('');
  constructor() {
    this.sheetData = this.bottomSheetService.data();
  }

  retryOtp(isRetryOtp: boolean) {
    if (isRetryOtp) {
      const user: FineIdentityCheckUser = {
        cellNumber: this.sheetData.cellNumber,
        nationalCode: this.sheetData.nationalCode,
        vehicleType: VehicleType.CAR,
      };
      this.fineApiService.identityCheck(this.sheetData.plateNo, user).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({});
    }
  }

  fillOtp($event: string) {
    this.fineApiService
      .identityVerify(this.sheetData.plateNo, {
        otpCode: $event,
        cellNumber: this.sheetData.cellNumber,
        nationalCode: this.sheetData.nationalCode,
        vehicleType: VehicleType.CAR,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.bottomSheetService.outputData.set(response);
          this.bottomSheetService.closeBottomSheet();
        },
        error: (error) => {
          this.errorMessage.set(error?.result?.message || 'مقدار ورودی اشتباه است');
        },
      });
  }
}
