import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { OtpVerificationComponent } from '../../components/otp-verification/otp-verification.component';



@Component({
  selector: 'digipay-card-applet-card-attachment',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, DpIconComponent, RouterModule, NgxCalloutComponent, NgxButtonComponent],
  templateUrl: './card-attachment.component.html',
  styleUrls: ['./card-attachment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardAttachmentComponent  {
  private readonly router = inject(Router);
  private readonly bottomSheetService = inject(NgxBottomSheetService);



  private openOtp() {
    this.bottomSheetService.openBottomSheet(
      OtpVerificationComponent,
      {
        title: 'احراز هویت',
        phoneNumber: '09123456789',
      },
      { disableClose: true },
    );
    return;
  }
  cancel() {
    this.router.navigateByUrl('/');
  }
  approve() {
    this.openOtp();
  }
}
