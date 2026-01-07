import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JmConfig } from '../../data-access/models/jm-config.type';
import { JmMode } from '../../data-access/models/jm.enums';
import { JourneyManagerComponent } from '../journey/journey-manager/journey-manager.component';
import { NextActionComponent } from '../next-action/next-action/next-action.component';
import { JmBottomSheetComponent } from '../jm-bottom-sheet/jm-bottom-sheet.component';
import { JmActionHandlerService } from '../../data-access/services/jm-action-handler.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'common-journey-management-base-jm-renderer',
  standalone: true,
  imports: [CommonModule, JourneyManagerComponent, NextActionComponent],
  templateUrl: './base-jm-renderer.component.html',
  styleUrl: './base-jm-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseJmRendererComponent {
  config = input<JmConfig>();
  isLoading = input<boolean>(false);
  JmMode = JmMode;
  primaryClicked = output();
  secondaryClicked = output();
  bottomSheetService = inject(NgxBottomSheetService<any, { config: JmConfig }>);
  jmActionHandlerService = inject(JmActionHandlerService);
  handlePrimaryClick(): void {
    this.jmActionHandlerService.handle(this.config()?.data.primaryAction.action ?? undefined);
    this.primaryClicked.emit();
  }

  handleSecondaryClick(): void {
    this.bottomSheetService.openBottomSheet(JmBottomSheetComponent, { config: this.config() });
    this.secondaryClicked.emit();
  }
}
