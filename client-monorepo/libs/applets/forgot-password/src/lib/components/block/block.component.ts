import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorResultComponent, OverlayManagerService } from '@client-monorepo/common/ui-components';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'forgot-password-applet-block',
  standalone: true,
  imports: [CommonModule, ErrorResultComponent, NgxButtonComponent],
  templateUrl: './block.component.html',
  styleUrl: './block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockComponent {
  resetTime = computed(() => this.overlayManagerService.data()?.attemptsResetTime);
  overlayManagerService = inject(OverlayManagerService);

  close(): void {
    this.overlayManagerService.closeOverlay();
  }

  support(): void {
    window.open('tel:+982153924000');
  }
}
