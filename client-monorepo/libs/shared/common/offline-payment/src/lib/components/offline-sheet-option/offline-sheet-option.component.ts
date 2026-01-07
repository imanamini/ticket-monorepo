import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'common-offline-payment-offline-sheet-option',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxButtonComponent],
  templateUrl: './offline-sheet-option.component.html',
  styleUrl: './offline-sheet-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineSheetOptionComponent implements OnInit {
  private actionHandler = inject(ActionHandlerService);
  private eventManagementService = inject(EventManagementService);
  private ngxBottomSheetService = inject(NgxBottomSheetService);

  sourceData = signal('');

  ngOnInit() {
    this.sourceData.set(this.ngxBottomSheetService?.data()?.resource);
  }

  onScannerClicked(): void {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: [this.sourceData()],
      data: {
        target: 'qr-scanner-sheet',
      },
    });
    this.actionHandler
      .handle({
        type: ActionType.GO_TO_SERVICE,
        payload: {
          serviceId: FrequentServicesIdEnum.BARCODE_SCANNER,
        },
      })
      .then();
  }

  onBarcodeClicked(): void {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: [this.sourceData()],
      data: {
        target: 'barcode-sheet',
      },
    });
    this.actionHandler
      .handle({
        type: ActionType.REDIRECT,
        payload: {
          url: 'barcode',
          params: {
            referrer: this.sourceData(),
          },
        },
      })
      .then();
  }
}
