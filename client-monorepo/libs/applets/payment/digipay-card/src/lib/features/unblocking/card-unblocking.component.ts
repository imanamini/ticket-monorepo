import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { CardInfoFormComponent } from '../../components/card-info-form/card-info-form.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { OtpVerificationComponent } from '../../components/otp-verification/otp-verification.component';

@Component({
  selector: 'digipay-card-applet--card-unblocking',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, CardInfoFormComponent],
  templateUrl: './card-unblocking.component.html',
  styleUrl: './card-unblocking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardUnblockingComponent {
  private readonly bottomSheetService = inject(NgxBottomSheetService);

  handleVerification(entity: any) {
    this.bottomSheetService.openBottomSheet(
      OtpVerificationComponent,
      {
        title: 'احراز هویت',
        phoneNumber: '09123456789',
      },
      { disableClose: true },
    );
    const subscription = this.bottomSheetService.onClose.subscribe(() => {
      const outputData = this.bottomSheetService.outputData();

      switch (outputData?.type) {
        case 'SUCCESS':
          break;
        case 'CANCEL':
          break;
      }

      subscription.unsubscribe();
    });
  }
}
