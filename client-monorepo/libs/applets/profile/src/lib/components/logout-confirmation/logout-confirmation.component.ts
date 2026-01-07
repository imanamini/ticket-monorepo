import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-logout-confirmation',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxBottomSheetHeaderComponent, NgxButtonComponent],
  templateUrl: './logout-confirmation.component.html',
  styleUrl: './logout-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutConfirmationComponent {
  bottomSheetService = inject(NgxBottomSheetService);

  closeLogoutBottomSheet(): void {
    this.bottomSheetService.closeBottomSheet();
  }

  orderToLogout(): void {
    this.bottomSheetService.outputData.set('logout');
    this.bottomSheetService.closeBottomSheet();
  }
}
