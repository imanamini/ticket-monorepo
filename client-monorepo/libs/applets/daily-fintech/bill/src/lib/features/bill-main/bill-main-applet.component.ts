import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FramedIconComponent, PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { BillApiService } from '../../data-access/services/bill-api.service';
import { BillTypeModel } from '../../data-access/models/bill-type.model';
import {
  DailyFintechRecommendationListComponent,
  RECOMMENDATION_TYPES,
  RecommendationData,
} from '@client-monorepo/daily-fintech/recommendation';
import { MessageService } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { BillMainSkeletonComponent } from '../../componensts/bill-loading-skeleton/bill-main-skeleton/bill-main-skeleton.component';
import { BillValidationService } from '../../data-access/services/bill-validation.service';
import { DailyFintechTouchPointComponent } from '@client-monorepo/shared/daily-fintech/touch-point';
import { AssetTypes } from '@client-monorepo/common/user-assets';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bill-applet-main',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    DailyFintechRecommendationListComponent,
    FramedIconComponent,
    BillMainSkeletonComponent,
    DailyFintechTouchPointComponent,
    NgxButtonComponent,
  ],
  templateUrl: './bill-main-applet.component.html',
  styleUrl: './bill-main-applet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillMainAppletComponent implements OnInit {
  private router = inject(Router);
  private billValidationService = inject(BillValidationService);
  private billApiService = inject(BillApiService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  imageType = signal(ServiceImagesType.IMAGE_ID);
  isLoading = signal(true);
  billTypes = signal<BillTypeModel[]>([]);
  otherBills = signal<BillTypeModel | null>(null);

  protected readonly AssetTypes = AssetTypes;
  protected readonly RECOMMENDATION_TYPES = RECOMMENDATION_TYPES;

  ngOnInit(): void {
    this.billApiService
      .getBillConfig()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (billConfig) => {
          this.isLoading.set(false);
          this.billTypes.set(billConfig.configs);
          this.setOtherBill();
        },
        error: (error: any) => {
          this.messageService.showErrorOfErrorResponse(error);
          this.isLoading.set(false);
        },
      });
  }

  private setOtherBill() {
    const others = this.billTypes().filter((b) => b.type === 0);
    if (others.length > 0) {
      this.otherBills.set(others[0]);
    }
  }

  billItemClicked(billItem: BillTypeModel | null) {
    if (!billItem?.active) {
      this.messageService.showErrorMessage(billItem!.badge.message);
      return;
    }
    this.navigateToBillValidate(billItem.type);
  }

  private navigateToBillValidate(billType: number, id?: string) {
    this.router.navigate(['bill', 'identifier', billType], { queryParams: { id: id } }).then();
  }

  recommendationItemClicked(data: RecommendationData) {
    this.navigateToBillValidate(data.type, data.id);
    this.billValidationService.isFastInquiry.set(true);
  }
}
