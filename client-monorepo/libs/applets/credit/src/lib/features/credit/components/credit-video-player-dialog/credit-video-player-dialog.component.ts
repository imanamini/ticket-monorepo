import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'app-credit-video-player-dialog',
  templateUrl: './credit-video-player-dialog.component.html',
  styleUrls: ['./credit-video-player-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditVideoPlayerDialogComponent {
  videoUrl = signal<string | null>(null);
  bottomSheetService = inject(NgxBottomSheetService);

  constructor() {
    if (!this.bottomSheetService.data().videoUrl) {
      this.bottomSheetService.closeBottomSheet();
    }
    this.videoUrl.set(this.bottomSheetService.data().videoUrl);
  }
}
