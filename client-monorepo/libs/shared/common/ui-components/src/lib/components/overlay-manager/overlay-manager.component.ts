import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayManagerService } from '../../data-access/services/overlay-manager.service';
import { OverlayManagerConfig } from '../../data-access/models/overlay-manager-config';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'common-ui-component-overlay-manager',
  standalone: true,
  imports: [CommonModule, DpIconComponent],
  templateUrl: './overlay-manager.component.html',
  styleUrl: './overlay-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayManagerComponent {
  isVisible = computed(() => this.overlayManagerService.isVisible());
  component = computed(() => this.overlayManagerService.component());
  config = computed(() => (this.overlayManagerService.config() ? (this.overlayManagerService.config() as OverlayManagerConfig) : null));
  overlayManagerService = inject(OverlayManagerService);

  handleBackAction(): void {
    this.overlayManagerService.closeOverlay();
  }
}
