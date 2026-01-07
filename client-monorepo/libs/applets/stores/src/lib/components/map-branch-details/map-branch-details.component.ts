import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { BranchOverviewComponent } from '../store-branch-overview/branch-overview.component';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { BranchModel, Store, StorePaymentMethod, StoreType } from '@client-monorepo/stores';
import { FramedIconComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';

@Component({
  selector: 'stores-applet-map-branch-details',
  standalone: true,
  imports: [CommonModule, ApiImageModule, BranchOverviewComponent, NgxBadgeModule, FramedIconComponent],
  templateUrl: './map-branch-details.component.html',
  styleUrl: './map-branch-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapBranchDetailsComponent {
  protected readonly ServiceImagesType = ServiceImagesType;
  selectedBranch = input.required<BranchModel>();
  branchOverview = computed(() => {
    if (!this.selectedBranch()) return;
    const branch = this.selectedBranch();
    const modified: BranchModel = {
      address: branch?.address ?? '',
      branchId: branch?.branchId ?? '',
      creationDate: branch?.creationDate ?? 0,
      distance: branch?.distance ?? 0,
      lastModificationDate: 0,
      location: branch?.location ?? { latitude: 0, longitude: 0 },
      phoneNumber: branch?.phoneNumber ?? '',
      store: branch?.store ?? ({} as Store),
      storeTrackingCode: branch?.storeTrackingCode ?? '',
      title: branch?.title ?? '',
    };
    return modified;
  });
  paymentMethodBadges = computed<string[]>(() => {
    const badges: string[] = [];
    const hasBnpl = this.selectedBranch()?.store.paymentMethods.includes(StorePaymentMethod.BNPL);
    const hasCredit = this.selectedBranch()?.store.paymentMethods.includes(StorePaymentMethod.C_CREDIT);
    const isOnline = this.selectedBranch()?.store.types.includes(StoreType.ONLINE);
    const isOnsite = this.selectedBranch()?.store.types.includes(StoreType.ONSITE);
    const paymentTypeCode = (hasBnpl ? '1' : '0') + (hasCredit ? '1' : '0');
    const storeTypeCode = (isOnline ? '1' : '0') + (isOnsite ? '1' : '0');
    const paymentTypeMap: { [key: string]: string } = {
      '11': 'خرید با وام و اعتبار',
      '10': 'خرید اعتباری',
      '01': 'خرید با وام',
    };
    const storeTypeMap: { [key: string]: string } = {
      '11': 'آنلاین و حضوری',
      '10': 'آنلاین',
      '01': 'حضوری',
    };
    if (paymentTypeMap[paymentTypeCode]) {
      badges.push(paymentTypeMap[paymentTypeCode]);
    }
    if (storeTypeMap[storeTypeCode]) {
      badges.push(storeTypeMap[storeTypeCode]);
    }
    return badges;
  });
}
