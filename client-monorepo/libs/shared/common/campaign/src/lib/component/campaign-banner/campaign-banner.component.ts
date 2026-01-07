import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../data-access/services/campaign.servcie';

@Component({
  selector: 'shared-common-campaign-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-banner.component.html',
  styleUrl: './campaign-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignBannerComponent {
  campaignService = inject(CampaignService);
  activeCampaign = this.campaignService.activeCampaign();
}
