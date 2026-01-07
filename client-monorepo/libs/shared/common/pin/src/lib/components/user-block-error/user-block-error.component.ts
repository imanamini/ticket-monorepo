import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorResultComponent, OverlayManagerService } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'common-pin-user-block-error',
  standalone: true,
  imports: [CommonModule, ErrorResultComponent],
  templateUrl: './user-block-error.component.html',
  styleUrl: './user-block-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBlockErrorComponent {
  resetTime = computed(() => this.overlayManagerService.data()?.attemptsResetTime);
  overlayManagerService = inject(OverlayManagerService);

  close(): void {
    this.overlayManagerService.closeOverlay();
  }
}
