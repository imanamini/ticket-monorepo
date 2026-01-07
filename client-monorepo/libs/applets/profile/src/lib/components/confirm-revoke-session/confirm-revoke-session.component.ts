import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'profile-applet-confirm-revoke-session',
  standalone: true,
  imports: [CommonModule, NgxStatusResultModule],
  templateUrl: './confirm-revoke-session.component.html',
  styleUrl: './confirm-revoke-session.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmRevokeSessionComponent {
  bottomSheetService = inject(NgxBottomSheetService);
  config = computed(() => this.bottomSheetService.data().config);

  checkClick(id: string) {
    this.bottomSheetService.outputData.set(id === 'primary');
    this.bottomSheetService.closeBottomSheet();
  }
}
