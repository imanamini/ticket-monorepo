import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViolationPurchaseStatusModel } from '../../data-access/models/violation.model';
import { PurchaseStatusList, ViolationBottomSheetItemsMapper, ViolationPurchaseStatus } from '../../data-access/constants/violation.const';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { ViolationService } from '../../data-access/services/violation.service';
import { StoreRestrictionFields, StoresApiService } from '@client-monorepo/stores';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'stores-applet-violation-purchase-status-selector',
  standalone: true,
  imports: [CommonModule, NgxDividerComponent, NgxIcon],
  templateUrl: './violation-purchase-status-selector.component.html',
  styleUrl: './violation-purchase-status-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationPurchaseStatusSelectorComponent implements OnInit {
  violationService = inject(ViolationService);
  bottomSheetService = inject(NgxBottomSheetService);
  destroyRef = inject(DestroyRef);
  storesApi = inject(StoresApiService);

  protected readonly PurchaseStatusList = PurchaseStatusList;
  paramsTrackingCode = signal<string | undefined>(undefined);

  ngOnInit(): void {
    if (this.violationService.params()['trackingCode']) {
      this.paramsTrackingCode.set(this.violationService.params()['trackingCode']);
      this.getStore();
      return;
    }
  }

  getStore(): void {
    const restriction = StoreRestrictionFields.TRACKING_CODE;
    this.storesApi.getStore(this.paramsTrackingCode()!, restriction).subscribe({
      next: (result) => {
        this.violationService.store.set(result);
      },
    });
  }

  handlePurchaseStatusClick(stat: ViolationPurchaseStatusModel): void {
    const store = this.violationService.store();
    this.violationService.purchaseStatus.set(stat.status);
    if (stat.status === ViolationPurchaseStatus.NOT_PURCHASED && store) {
      if (store?.types.length === 1) {
        this.violationService.paymentMethod.set(store.types[0]);
        this.violationService.sectionToShow.set('STEPPER');
        this.violationService.nextStep();
      } else {
        this.showReferralMethodBottomSheet();
      }
    } else {
      this.violationService.sectionToShow.set('STEPPER');
    }
  }

  showReferralMethodBottomSheet(): void {
    const items = this.violationService.store()?.types?.map((type) => ViolationBottomSheetItemsMapper[type]);
    this.violationService.showBottomSheet(items, 'روش مراجعه', () => {
      this.violationService.sectionToShow.set('STEPPER');
    });
  }
}
