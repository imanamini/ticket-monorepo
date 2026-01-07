import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PinLayoutService } from '../../data-access/services/pin-layout.service';
import { CommonModule } from '@angular/common';
import { PinComponent } from '../pin/pin.component';
import { PinConfigInterface } from '../../data-access/models/pin-config.interface';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { PinStatus } from '@digipay/ngx-pin';

@Component({
  selector: 'common-pin-layout',
  standalone: true,
  imports: [CommonModule, DpIconComponent, PinComponent, NgxButtonComponent],
  templateUrl: './pin-layout.component.html',
  styleUrls: ['./pin-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinLayoutComponent {
  isVisible = computed(() => this.pinLayoutService.isVisible());
  pinConfig = input<PinConfigInterface>({} as PinConfigInterface);
  layoutConfig = computed(() => this.pinLayoutService.pinOverlayConfig() ?? this.pinConfig());
  callbackFunction = output<PinStatus>();
  pinOutput = output<string>(); //todo merge it to callbackFunction and refactor them
  pinLayoutService = inject(PinLayoutService);
  actionHandlerService = inject(ActionHandlerService);
  private eventService = inject(NgxEventTrackerService);
  handleBackAction(): void {
    this.handleCallbackFunction(PinStatus.FAILED);
  }

  handleCallbackFunction(result: PinStatus): void {
    if (this.layoutConfig()?.isOverlay) {
      this.pinLayoutService.hide(result);
    } else {
      this.callbackFunction.emit(result);
    }
  }

  handleResetPassword(): void {
    this.eventService.sendEvent({
      eventName: 'forgetPass-pin-clicked',
      eventData: {},
    });
    const layoutConfig = this.layoutConfig(); // Store the config to avoid multiple function calls

    if (layoutConfig?.isOverlay) {
      this.handleCallbackFunction(PinStatus.FAILED);
    }

    const params: Record<string, string> = {
      'callback-url': layoutConfig.resetPinCallbackUrl || window.location.pathname,
      'fallback-url': window.location.pathname,
      ...(layoutConfig?.isOverlay && { 'nav-by-reload': '1' }),
    };

    this.actionHandlerService.handle({
      type: ActionType.REDIRECT,
      payload: { url: '/forgot-password', params },
    });
  }
}
