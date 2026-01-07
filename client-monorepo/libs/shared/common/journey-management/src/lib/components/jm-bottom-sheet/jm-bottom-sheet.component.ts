import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action, JmConfig } from '@client-monorepo/common/journey-management';
import { JourneyTopSectionComponent } from '../journey/journey-top-section/journey-top-section.component';
import { JmActionHandlerService } from '../../data-access/services/jm-action-handler.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-journey-management-jm-bottom-sheet',
  standalone: true,
  imports: [CommonModule, JourneyTopSectionComponent, NgxButtonComponent],
  templateUrl: './jm-bottom-sheet.component.html',
  styleUrl: './jm-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JmBottomSheetComponent {
  bottomSheetService = inject(NgxBottomSheetService<any, { config: JmConfig }>);
  jmActionHandlerService = inject(JmActionHandlerService);
  config = computed<JmConfig>(() => {
    return this.bottomSheetService.data().config;
  });
  handleClick(action: Action | undefined): void {
    this.jmActionHandlerService.handle(action);
    this.bottomSheetService.closeBottomSheet();
  }
}
