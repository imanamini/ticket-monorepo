import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FramedIconComponent, PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { CharityApiService } from '../../data-access/services/charity-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { Organization } from '../../data-access/models/charity-config.response.model';
import { map } from 'rxjs';
import {
  DailyFintechRecommendationListComponent,
  RECOMMENDATION_TYPES,
  RecommendationData,
} from '@client-monorepo/daily-fintech/recommendation';
import { CharityAmountComponent } from '../../components/charity-amount.component/charity-amount.component';
import { Router } from '@angular/router';
import { CharityService } from '../../data-access/services/charity.service';
import { CharityPurchaseModel } from '../../data-access/models/charity-purchase.model';
import { AssetTypes } from '@client-monorepo/common/user-assets';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'charity-applet-main',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, FramedIconComponent, DailyFintechRecommendationListComponent],
  templateUrl: './applets-charity.component.html',
  styleUrl: './applets-charity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppletsCharityComponent implements OnInit {
  recommendationType: RECOMMENDATION_TYPES = RECOMMENDATION_TYPES.CHARITY;
  charityOrganization = signal<Organization[]>([]);
  charityApiService = inject(CharityApiService);
  messageService = inject(MessageService);
  charityService = inject(CharityService);
  router = inject(Router);
  bottomSheetService = inject(NgxBottomSheetService);
  imageType = ServiceImagesType.IMAGE_ID;

  ngOnInit(): void {
    this.charityApiService
      .getCharityConfig()
      .pipe(
        map((res) => {
          return res.organizations.sort((a: Organization, b: Organization) => a.placement - b.placement);
        }),
      )
      .subscribe({
        next: (data) => this.charityOrganization.set(data),
        error: (error: any) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  charityItemClicked(organization: Organization) {
    this.bottomSheetService.openBottomSheet(CharityAmountComponent, {
      data: organization,
    });

    const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      const result = this.bottomSheetService.outputData()?.result;
      if (result) {
        this.navigateToConfirm(result);
      }
      bottomSheetSubscriber.unsubscribe();
    });
  }

  recommendationItemClicked(data: RecommendationData) {
    const recommendations: CharityPurchaseModel = {
      amount: data.amount,
      organization: {
        businessId: data.organization,
        colors: data.colors,
        defaultAmount: 0,
        description: data.title,
        imageId: data.imageId,
        maxAmount: 0,
        minAmount: 0,
        name: data.title,
        placement: 0,
        recommendations: [],
        supportedTypes: [],
      },
    };
    this.navigateToConfirm(recommendations);
  }

  navigateToConfirm(data: CharityPurchaseModel) {
    this.charityService.setCharityData(data);
    this.router.navigate(['donation', 'confirm']).then();
  }

  protected readonly AssetTypes = AssetTypes;
}
